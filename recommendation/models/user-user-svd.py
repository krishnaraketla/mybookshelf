import pandas as pd
import numpy as np
from scipy.sparse.linalg import svds
from scipy.sparse import csr_matrix
from sklearn.model_selection import train_test_split

class BookRecommenderSVD:
    def __init__(self, interactions_path):
        self.interactions = pd.read_csv(interactions_path)
        self.user_item_matrix = None
        self.user_ids = None
        self.book_ids = None

    def build_user_item_matrix(self):
        matrix_df = self.interactions.pivot(index='user_id', columns='book_id', values='rating').fillna(0).astype(float)
        self.user_ids = matrix_df.index.tolist()
        self.book_ids = matrix_df.columns.tolist()
        self.user_item_matrix = csr_matrix(matrix_df)  # Convert DataFrame to CSR matrix after capturing indices and columns

    def perform_svd(self):
        U, sigma, Vt = svds(self.user_item_matrix, k=min(50, min(self.user_item_matrix.shape)-1))
        sigma = np.diag(sigma)
        return U, sigma, Vt

    def recommend_books(self, user_index, U, sigma, Vt, top_n=100):
        # Compute predicted ratings for the user
        user_ratings = np.dot(np.dot(U[user_index, :], sigma), Vt)

        # Get the indices of the top N recommended books
        recommended_books_indices = np.argsort(user_ratings)[-top_n:][::-1]  # This should return a simple array of integers

        # Fetch the corresponding book IDs from these indices
        recommended_books = [self.book_ids[int(i)] for i in recommended_books_indices]  # Cast index to int explicitly

        return recommended_books

    def split_data(self):
        train, test = train_test_split(self.interactions, test_size=0.2, random_state=42)
        return train, test

    def evaluate(self, train, test):
        self.build_user_item_matrix()
        U, sigma, Vt = self.perform_svd()
        
        hit_count = 0
        for idx in test.index:
            user_id = test.at[idx, 'user_id']
            if user_id in self.user_ids:
                user_index = self.user_ids.index(user_id)
                recommended_books = self.recommend_books(user_index, U, sigma, Vt, top_n=200)
                true_book = test.at[idx, 'book_id']
                if true_book in recommended_books:
                    hit_count += 1
        
        hit_rate = hit_count / len(test)
        return hit_rate
    
    def recommend_for_new_user(self, new_user_ratings, top_n=10):
        # Create a new user-item matrix including the new user
        new_user_id = new_user_ratings['user_id'].iloc[0]
        new_user_matrix = new_user_ratings.pivot(index='user_id', columns='book_id', values='rating').fillna(0).reindex(columns=self.book_ids, fill_value=0)

        # Append the new user's matrix to the existing matrix
        combined_matrix = csr_matrix(np.vstack([self.user_item_matrix.toarray(), new_user_matrix.to_numpy()]))

        # Perform SVD on the combined matrix
        U, sigma, Vt = svds(combined_matrix, k=min(50, min(combined_matrix.shape)-1))

        # Get recommendations for the new user (last index as it's the new addition)
        user_index = combined_matrix.shape[0] - 1
        recommended_books_indices = self.recommend_books(user_index, U, sigma, Vt, top_n)

        # Return the book IDs and their predicted ratings
        return [(self.book_ids[int(i)], np.dot(np.dot(U[user_index, :], sigma), Vt[:, int(i)])) for i in recommended_books_indices]

# Usage remains the same

# Usage
if __name__ == "__main__":
    svd_recommender = BookRecommenderSVD("ML/data/interactions.csv")
    train_data, test_data = svd_recommender.split_data()
    hit_rate = svd_recommender.evaluate(train_data, test_data)
    print(f"Hit Rate: {hit_rate:.2f}")

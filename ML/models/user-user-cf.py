import pandas as pd
import numpy as np
from scipy.sparse import csr_matrix
from sklearn.metrics.pairwise import cosine_similarity

class UserUserCF:
    def __init__(self, interactions_path, book_id_map_path, book_works_path):
        # Load the data
        self.interactions = pd.read_csv(interactions_path)
        self.book_id_map_df = pd.read_csv(book_id_map_path)
        self.book_works_df = pd.read_csv(book_works_path)

        # Create a mapping from CSV book IDs to book IDs
        self.book_id_map = dict(zip(self.book_id_map_df['book_id_csv'], self.book_id_map_df['book_id']))

        # Build the user-item matrix
        self.user_item_csr, self.book_rating_counts, self.columns = self.build_user_item_matrix(self.interactions)

    def get_work_id(self, book_id):
        return self.book_id_map[book_id]

    def get_original_title_by_book_id(self, work_id):
        match = self.book_works_df[self.book_works_df['best_book_id'] == work_id]
        if not match.empty:
            return match['original_title'].values[0]
        else:
            return None

    def build_user_item_matrix(self, interactions):
        user_item_matrix = interactions.pivot(index='user_id', columns='book_id', values='rating')
        
        user_means = user_item_matrix.mean(axis=1)
        user_item_matrix = user_item_matrix.sub(user_means, axis=0)
        
        # Count number of ratings a book has received
        book_rating_counts = ((user_item_matrix != 0) & (user_item_matrix.notna())).sum(axis=0)
        
        user_item_matrix = user_item_matrix.fillna(0)
        
        # Normalize the ratings by dividing by the book rating counts
        normalized_user_item_matrix = user_item_matrix.div(book_rating_counts, axis=1).fillna(0)
        
        user_item_csr = csr_matrix(normalized_user_item_matrix.values)
        
        return user_item_csr, book_rating_counts, user_item_matrix.columns

    def predict_new_ratings(self, new_user_csr, similarities):
        new_user_dense = new_user_csr.toarray()
        user_item_dense = self.user_item_csr.toarray()
        
        predicted_ratings = new_user_dense.copy()
        
        for book_idx in range(new_user_dense.shape[1]):
            if new_user_dense[0, book_idx] == 0:
                book_ratings = user_item_dense[:, book_idx]
                
                weighted_sum = np.dot(similarities, book_ratings)
                sum_of_weights = np.sum(np.abs(similarities))
                
                if sum_of_weights != 0:
                    predicted_rating = weighted_sum / sum_of_weights
                else:
                    predicted_rating = 0
                
                predicted_ratings[0, book_idx] = predicted_rating
        
        return predicted_ratings

    def get_top_n_predictions(self, new_user_csr, similarities, n=10):
        predicted_ratings = self.predict_new_ratings(new_user_csr, similarities)
        
        predicted_ratings = predicted_ratings.flatten()
        
        rated_indices = new_user_csr.nonzero()[1]
        
        predicted_ratings[rated_indices] = -np.inf
        
        top_n_indices = np.argsort(predicted_ratings)[-n:][::-1]
        
        top_n_ratings = predicted_ratings[top_n_indices]
        
        return top_n_indices, top_n_ratings

    def recommend_books(self, new_user_ratings, n=10):
        new_user_matrix = new_user_ratings.pivot(index='user_id', columns='book_id', values='rating')
        
        new_user_matrix = new_user_matrix.reindex(columns=self.columns)
        
        new_user_means = new_user_matrix.mean(axis=1)
        new_user_matrix = new_user_matrix.sub(new_user_means, axis=0)
        
        new_user_matrix = new_user_matrix.fillna(0)
        
        new_user_csr = csr_matrix(new_user_matrix.values)
        
        similarities = cosine_similarity(new_user_csr, self.user_item_csr)
        
        top_n_indices, top_n_ratings = self.get_top_n_predictions(new_user_csr, similarities, n=n)
        
        top_n_book_ids = self.columns[top_n_indices]
        
        top_n_ratings_denormalized = top_n_ratings + new_user_means.values[0]
        
        print("Books you have rated:")
        for idx, row in new_user_ratings.iterrows():
            work_id = self.get_work_id(row['book_id'])
            title = self.get_original_title_by_book_id(work_id)
            print(f"Book ID: {row['book_id']}, Title: {title}, Rating: {row['rating']}")
        
        print("\nBooks we recommend:")
        for book_id, rating in zip(top_n_book_ids, top_n_ratings_denormalized):
            work_id = self.get_work_id(book_id)
            title = self.get_original_title_by_book_id(work_id)
            print(f"Book ID: {book_id}, Title: {title}, Predicted Rating: {rating:.2f}")

# Example usage:
if __name__ == "__main__":
    # Create an instance of the UserUserCF class
    recommender = UserUserCF("ML/data/interactions.csv", "ML/data/book_id_map.csv", "ML/data/book_works.csv")
    
    # New user ratings
    new_user_ratings = pd.DataFrame({
        'user_id': [9999999999] * 9,
        'book_id': [7300, 1201, 100385, 530615, 48625, 14870, 7170, 19782, 1146577],
        'rating': [2, 3, 1, 5, 1, 3, 2, 4, 5]
    })
    
    # Get recommendations for the new user
    recommender.recommend_books(new_user_ratings, n=10)
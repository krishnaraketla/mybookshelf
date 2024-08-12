import pandas as pd
import numpy as np
from scipy.sparse import csr_matrix
from sklearn.metrics.pairwise import cosine_similarity

class ItemItemCF:
    def __init__(self, interactions_path, book_id_map_path, book_works_path):
        # Load the data
        self.interactions = pd.read_csv(interactions_path)
        self.book_id_map_df = pd.read_csv(book_id_map_path)
        self.book_works_df = pd.read_csv(book_works_path)

        # Create a mapping from CSV book IDs to book IDs
        self.book_id_map = dict(zip(self.book_id_map_df['book_id_csv'], self.book_id_map_df['book_id']))

        # Build the item-item matrix
        self.item_item_csr, self.book_rating_counts, self.index = self.build_item_item_matrix(self.interactions)

    def get_work_id(self, book_id):
        return self.book_id_map[book_id]

    def get_original_title_by_book_id(self, work_id):
        match = self.book_works_df[self.book_works_df['best_book_id'] == work_id]
        if not match.empty:
            return match['original_title'].values[0]
        else:
            return None

    def build_item_item_matrix(self, interactions):
        user_item_matrix = interactions.pivot(index='user_id', columns='book_id', values='rating')
        
        # Count number of ratings a book has received
        book_rating_counts = user_item_matrix.notna().sum(axis=0)
        
        # Normalize the ratings
        user_means = user_item_matrix.mean(axis=1)
        user_item_matrix = user_item_matrix.sub(user_means, axis=0)
        user_item_matrix = user_item_matrix.fillna(0)
        
        # Create item-item matrix
        item_item_matrix = user_item_matrix.T.dot(user_item_matrix)
        
        # Normalize by dividing each row by its number of non-zero entries
        nz_per_row = (item_item_matrix != 0).sum(axis=1)
        item_item_matrix = item_item_matrix.div(nz_per_row, axis=0)
        
        item_item_csr = csr_matrix(item_item_matrix.values)
        
        return item_item_csr, book_rating_counts, item_item_matrix.index

    def predict_new_ratings(self, new_user_ratings):
        new_user_vector = np.zeros(len(self.index))
        for _, row in new_user_ratings.iterrows():
            if row['book_id'] in self.index:
                idx = self.index.get_loc(row['book_id'])
                new_user_vector[idx] = row['rating']
        
        predicted_ratings = self.item_item_csr.dot(new_user_vector)
        return predicted_ratings

    def get_top_n_predictions(self, new_user_ratings, n=10):
        predicted_ratings = self.predict_new_ratings(new_user_ratings)
        
        # Set the ratings of already rated books to -inf
        for _, row in new_user_ratings.iterrows():
            if row['book_id'] in self.index:
                idx = self.index.get_loc(row['book_id'])
                predicted_ratings[idx] = -np.inf
        
        top_n_indices = np.argsort(predicted_ratings)[-n:][::-1]
        top_n_ratings = predicted_ratings[top_n_indices]
        
        return top_n_indices, top_n_ratings

    def recommend_books(self, new_user_ratings, n=10):
        top_n_indices, top_n_ratings = self.get_top_n_predictions(new_user_ratings, n=n)
        
        top_n_book_ids = self.index[top_n_indices]
        
        print("Books you have rated:")
        for _, row in new_user_ratings.iterrows():
            work_id = self.get_work_id(row['book_id'])
            title = self.get_original_title_by_book_id(work_id)
            print(f"Book ID: {row['book_id']}, Title: {title}, Rating: {row['rating']}")
        
        print("\nBooks we recommend:")
        for book_id, rating in zip(top_n_book_ids, top_n_ratings):
            work_id = self.get_work_id(book_id)
            title = self.get_original_title_by_book_id(work_id)
            print(f"Book ID: {book_id}, Title: {title}, Predicted Rating: {rating:.2f}")

# Example usage:
if __name__ == "__main__":
    # Create an instance of the ItemItemCF class
    recommender = ItemItemCF("ML/data/interactions.csv", "ML/data/book_id_map.csv", "ML/data/book_works.csv")
    
    # New user ratings
    new_user_ratings = pd.DataFrame({
        'user_id': 9999999999,
        'book_id': [7300, 1201, 100385, 530615, 48625, 14870, 7170, 19782, 1146577],
        'rating': [4, 3, 3, 2, 4, 3, 2, 5, 5]
    })
    
    # Get recommendations for the new user
    recommender.recommend_books(new_user_ratings, n=30)
from locust import HttpUser, task, between

class BookstoreUser(HttpUser):
    wait_time = between(1, 5)  # Simulate wait time between tasks
    
    @task
    def register_user(self):
        # Example data for user registration
        self.client.post("/register", json={
            "username": "test_user",
            "password": "password123"
        })
    
    @task
    def login(self):
        response = self.client.post("/login", json={
            "username": "test_user",
            "password": "password123"
        })
        # Extract the token and reuse it for authenticated endpoints
        if response.status_code == 200:
            self.token = response.json()['token']
    
    @task(3)  # Higher weight means this task runs more frequently
    def search_books(self):
        self.client.get("/books/title?query=Python", headers={"Authorization": f"Bearer {self.token}"})

    @task
    def add_book_to_shelf(self):
        self.client.post("/shelves/1/books", json={
            "title": "New Book",
            "description": "A new book description",
            "authors": ["Author One"]
        }, headers={"Authorization": f"Bearer {self.token}"})

# Configure the test to start
if __name__ == "__main__":
    import os
    os.system("locust -f backend/concurrency_test.py")
import time
from locust import HttpUser, task, between

class SimpleUser(HttpUser):
    wait_time = between(5, 15)

    @task
    def product(self):
        self.client.get("")
#Required Packages and Imports
import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class TestLoginPage(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        #WebDriver settings
        chrome_options = Options()
        # chrome_options.headless = True
        chrome_service = Service('/usr/bin/chromedriver')  
        cls.driver = webdriver.Chrome(service=chrome_service, options=chrome_options)
        cls.driver.maximize_window()
        cls.driver.implicitly_wait(10)
        #Assigning Base URL
        cls.base_url = "http://localhost:6014/login" 

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_login_with_valid_credentials(self):
        '''Testing login'''

        #Getting the required page
        self.driver.get(self.base_url)

        #Locating email and password fields
        email_field = self.driver.find_element(By.NAME, "email")
        password_field = self.driver.find_element(By.NAME, "password")

        #Feeding data into located fields
        email_field.send_keys("testuser@example.com")
        password_field.send_keys("password123")
        password_field.send_keys(Keys.RETURN)

        #Asserting if redirected to the correct page after login
        WebDriverWait(self.driver, 10).until(EC.url_contains("/manage-course"))
        self.assertIn("/manage-course", self.driver.current_url)

    def test_login_with_invalid_credentials(self):
        '''Wrong credentials'''

        #Getting the required page
        self.driver.get(self.base_url)

        #Locating email and password fields
        email_field = self.driver.find_element(By.NAME, "email")
        password_field = self.driver.find_element(By.NAME, "password")

        #Feeding data into located fields
        email_field.send_keys("testuser@example.com")
        password_field.send_keys("wrongpassword")
        password_field.send_keys(Keys.RETURN)

        #Asserting if error message is displayed
        time.sleep(2)
        error_message = self.driver.find_element(By.XPATH, "//p[contains(text(), 'Invalid credentials')]")
        self.assertTrue(error_message.is_displayed())

    def test_back_button_functionality(self):
        '''Back button'''

        #Getting the required page
        self.driver.get(self.base_url)

        #Locating back button
        back_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Back')]")

        #Click the back button
        back_button.click()

        #Asserting if redirected to the correct page after the action
        time.sleep(2)
        self.assertNotEqual(self.driver.current_url, self.base_url)

if __name__ == "__main__":
    unittest.main()

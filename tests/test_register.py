#Required Packages and Imports
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class TestRegisterPage(unittest.TestCase):

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
        cls.base_url = "http://localhost:6014/register"  

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_1register_with_valid_data(self):
        """Test registration with valid data."""

        #getting Base URL
        self.driver.get(self.base_url)

        #Locating required fields and feeding data
        self.driver.find_element(By.NAME, 'username').send_keys('johndoe')
        self.driver.find_element(By.NAME, 'email').send_keys('johndoe@example.com')
        self.driver.find_element(By.NAME, 'password').send_keys('validpassword')
        self.driver.find_element(By.TAG_NAME, "form").submit()

        time.sleep(2)

        #getting login URL
        self.driver.get("http://localhost:6014/login")

        #Locating required fields and feeding data
        self.driver.find_element(By.NAME, "email").send_keys("johndoe@example.com")
        self.driver.find_element(By.NAME, "password").send_keys("validpassword")
        self.driver.find_element(By.TAG_NAME, "form").submit()

        #Wait for correct redirection (ensures new user registration)
        WebDriverWait(self.driver, 10).until(EC.url_contains("/manage-course"))  
        self.assertIn("/manage-course", self.driver.current_url) 

    def test_2register_user_already_exists(self):
        """Test registration for existing user."""

        #getting Base URL
        self.driver.get(self.base_url)

        #Locating required fields and feeding data
        self.driver.find_element(By.NAME, 'username').send_keys('johndoe')
        self.driver.find_element(By.NAME, 'email').send_keys('johndoe@example.com')
        self.driver.find_element(By.NAME, 'password').send_keys('validpassword')
        self.driver.find_element(By.TAG_NAME, "form").submit()

        #Asserting if error message is displayed
        time.sleep(2)   
        error_message = self.driver.find_element(By.XPATH, "//div[contains(text(), 'User already exists')]")
        self.assertTrue(error_message.is_displayed())


    def test_register_with_missing_fields(self):
        """Test registration with missing fields to check validation."""

        #getting Base URL
        self.driver.get(self.base_url)

        #Locating required fields and feeding incomplete data
        self.driver.find_element(By.NAME, 'username').send_keys('johndoe')
        self.driver.find_element(By.NAME, 'email').send_keys('johndoe@example.com')
        
        #Check the form settings
        form = self.driver.find_element(By.TAG_NAME, "form")
        form_valid = self.driver.execute_script("return arguments[0].checkValidity();", form)
        
        #Assert if correct form settings are present
        self.assertFalse(form_valid)
        self.assertIn(self.base_url, self.driver.current_url)

    def test_navigation_to_login_page(self):
        """Test clicking the 'Sign in' link to navigate to the login page."""
        
        #getting Base URL
        self.driver.get(self.base_url)

        #locating sign in button in the Already have an account paragraph and clicking on it
        sign_in_link = self.driver.find_element(By.LINK_TEXT, "Sign in")
        sign_in_link.click()

        #wait for redirection and assert correct redirection
        WebDriverWait(self.driver, 10).until(EC.url_contains("/login"))
        self.assertIn("/login", self.driver.current_url)

    def test_back_button_functionality(self):
        """Test clicking the 'Back' button to return to the previous page."""
        
        #getting home URL (so that when back is pressed, we end up in home)
        self.driver.get('http://localhost:6014/')

        #getting Base URL
        self.driver.get(self.base_url)

        #locating back button and click it
        back_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Back')]")
        back_button.click()
        
        #Wait for redirection
        time.sleep(5)

        #Assert correct redirection
        self.assertNotEqual(self.driver.current_url, self.base_url)

if __name__ == "__main__":
    unittest.main()

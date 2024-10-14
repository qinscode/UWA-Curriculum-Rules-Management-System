#Required Packages and Imports
import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class TestProfilePage(unittest.TestCase):

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
        cls.base_url = "http://localhost:6014"
        #Getting login URL
        cls.driver.get(cls.base_url+'/login')
        #Locating required fields and feeding data
        cls.driver.find_element(By.NAME, "email").send_keys("testuser@example.com")
        cls.driver.find_element(By.NAME, "password").send_keys("password123")
        cls.driver.find_element(By.TAG_NAME, "form").submit()
        #Wait until Manage course URL is loaded
        WebDriverWait(cls.driver, 10).until(EC.url_contains(cls.base_url+'/manage-course'))
        #Getting Profile URL
        cls.driver.get(cls.base_url + '/profile')
        #Wait untl Profile URL is loaded
        WebDriverWait(cls.driver, 10).until(EC.url_contains(cls.base_url+'/profile'))

    @classmethod
    def tearDownClass(cls):
        #--Revert back to old username and email durinf teardown
        #Getting Profile URL
        cls.driver.get(cls.base_url + '/profile')

        #locate edit button and click on it
        cls.driver.find_element(By.XPATH, "//button[contains(text(), 'Edit Profile')]").click()
        time.sleep(1)

        #locate required fields and feeding data
        username_field = cls.driver.find_element(By.NAME, 'username')
        email_field = cls.driver.find_element(By.NAME, 'email')
        username_field.clear()
        username_field.send_keys('testuser')
        email_field.clear()
        email_field.send_keys('testuser@example.com')

        #locate save button and click on it
        cls.driver.find_element(By.XPATH, "//button[contains(text(), 'Save')]").click()
        time.sleep(1)

        #quit
        cls.driver.quit()    


    def test_1profile_details_display(self):
        """Test that the profile page displays correct user details."""

        # Check that the Username is displayed correctly
        #Locate username field and assert correct details
        username_display = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div/main/div/div/main/div/div/form/dl/div[1]/dd/div[contains(text(), 'testuser')]")
        self.assertTrue(username_display.is_displayed())

        # Check that the Email is displayed correctly
        #Locate email field and assert correct details
        email_display = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div/main/div/div/main/div/div/form/dl/div[2]/dd/div[contains(text(), 'testuser@example.com')]")
        self.assertTrue(email_display.is_displayed())

        # Check the role display
        #Locate role field and assert correct details
        role_display = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div/main/div/div/main/div/div/form/dl/div[3]/dd/div[contains(text(), 'Administrator')]")
        self.assertTrue(role_display.is_displayed())

    def test_2cancel_button(self):
        """Test that the Cancel button appears after clicking Edit."""

        #locate edit button and click on it
        edit_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Edit Profile')]")
        edit_button.click()

        time.sleep(1)

        #locate cancel button and assert correct display
        cancel_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Cancel')]")
        self.assertTrue(cancel_button.is_displayed(), "Cancel button should be displayed after clicking Edit.")

        #click the cancel function
        cancel_button.click()
        time.sleep(1)

        # Check that the original Username is displayed correctly
        username_display = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div/main/div/div/main/div/div/form/dl/div[1]/dd/div[contains(text(), 'testuser')]")
        self.assertTrue(username_display.is_displayed())

        # Check that the  original Email is displayed correctly
        email_display = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div/main/div/div/main/div/div/form/dl/div[2]/dd/div[contains(text(), 'testuser@example.com')]")
        self.assertTrue(email_display.is_displayed())


    def test_3edit_profile(self):
        """Test editing the profile details."""

        #locate edit button and click it
        self.driver.find_element(By.XPATH, "//button[contains(text(), 'Edit Profile')]").click()
        time.sleep(1)

        #Edit the username and email fields
        #locate required fields and feedind data
        username_field = self.driver.find_element(By.NAME, 'username')
        email_field = self.driver.find_element(By.NAME, 'email')
        username_field.clear()
        username_field.send_keys('newtestuser')
        email_field.clear()
        email_field.send_keys('newtestuser@example.com')

        #locate Save button and click it
        self.driver.find_element(By.XPATH, "//button[contains(text(), 'Save')]").click()
        time.sleep(1)

        #Assert the profile has been updated (username and email)
        updated_username_display = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div/main/div/div/main/div/div/form/dl/div[1]/dd/div[contains(text(), 'newtestuser')]")
        self.assertTrue(updated_username_display.is_displayed())
        updated_email_display = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div/main/div/div/main/div/div/form/dl/div[2]/dd/div[contains(text(), 'newtestuser@example.com')]")
        self.assertTrue(updated_email_display.is_displayed())

if __name__ == "__main__":
    unittest.main()
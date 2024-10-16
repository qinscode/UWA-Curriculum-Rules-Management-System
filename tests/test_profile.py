#Required Packages and Imports
import unittest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
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
        username_display = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div/main/div/div/div/div[2]/div[2]/form/div[1]/div[1]/div[contains(text(), 'testuser')]")
        self.assertTrue(username_display.is_displayed())

        # Check that the Email is displayed correctly
        #Locate email field and assert correct details
        email_display = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div/main/div/div/div/div[2]/div[2]/form/div[1]/div[2]/div[contains(text(), 'testuser@example.com')]")
        self.assertTrue(email_display.is_displayed())

        # Check the role display
        #Locate role field and assert correct details
        role_display = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div/main/div/div/div/div[2]/div[2]/form/div[1]/div[3]/div[contains(text(), 'Administrator')]")
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
        username_display = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div/main/div/div/div/div[2]/div[2]/form/div[1]/div[1]/div[contains(text(), 'testuser')]")
        self.assertTrue(username_display.is_displayed())

        # Check that the  original Email is displayed correctly
        email_display = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div/main/div/div/div/div[2]/div[2]/form/div[1]/div[2]/div[contains(text(), 'testuser@example.com')]")
        self.assertTrue(email_display.is_displayed()) 

    def test_3create_admin_user_cancelButton(self):
        """Test the cancel button in the create admin user section""" 

        #find and click the View All Users button
        view_users_button = self.driver.find_element(By.XPATH, "//button[contains(text(),'View All Users')]")
        view_users_button.click()
        time.sleep(1)

        user_table1 = self.driver.find_element(By.XPATH, "//table")
        length_table_before_cancel = len(user_table1.find_elements(By.XPATH, "//tbody/tr"))

        #find and click the Create Admin User button
        create_admin_button = self.driver.find_element(By.XPATH, "//button[contains(text(),'Create Admin User')]")
        time.sleep(1)
        create_admin_button.click()

        #find and click the Cancel button
        cancel_button = self.driver.find_element(By.XPATH, "//button[contains(text(),'Cancel')]")
        time.sleep(1)
        cancel_button.click()

        user_table2 = self.driver.find_element(By.XPATH, "//table")
        length_table_after_cancel = len(user_table2.find_elements(By.XPATH, "//tbody/tr"))

        assert length_table_before_cancel == length_table_after_cancel

    def test_4create_admin_user(self):
        """Test creation of an admin user from an admin account"""

        #find and click the Create Admin User button
        create_admin_button = self.driver.find_element(By.XPATH, "//button[contains(text(),'Create Admin User')]")
        time.sleep(1)
        create_admin_button.click()

        #find the input boxes and fill in admin user details
        self.driver.find_element(By.NAME, "username").send_keys("test-admin")
        self.driver.find_element(By.NAME, "email").send_keys("adharsh@example.com")
        self.driver.find_element(By.NAME, "password").send_keys("securepassword")

        #Submit form
        time.sleep(1)
        self.driver.find_element(By.XPATH, "//button[contains(text(),'Create Admin')]").click()

        #Assert success message appears
        success = self.driver.find_element(By.XPATH, "//div[contains(text(),'Admin user created')]")
        time.sleep(0.2)
        self.assertTrue(success.is_displayed()) 

    def test_5view_users(self):
        """Test viewing users as an admin"""

        #find and click the View All Users button
        view_users_button = self.driver.find_element(By.XPATH, "//button[contains(text(),'View All Users')]")
        view_users_button.click()
        time.sleep(1)

        #assert that the user list is displayed
        user_table = self.driver.find_element(By.XPATH, "//table")
        time.sleep(1)
        self.assertTrue(user_table.is_displayed())

        #check if the data is displayed(excluding header)
        rows = user_table.find_elements(By.XPATH, "//tbody/tr")
        self.assertTrue(len(rows) > 0)
    
    def test_6delete_user(self):
        """Test deletion of users as admin"""

        #Click the View All Users button
        view_users_button = self.driver.find_element(By.XPATH, "//button[contains(text(),'View All Users')]")
        time.sleep(1)
        view_users_button.click()

        #Find and delete the admin user created by the automated test
        delete_button = self.driver.find_element(By.XPATH, "//tbody/tr[last()]//button[contains(text(),'Delete')]")
        actions = ActionChains(self.driver)
        actions.move_to_element(delete_button).perform()
        delete_button.click()

        #Assert success toast message appears
        success_toast = self.driver.find_element(By.XPATH, "//div[contains(text(),'User deleted')]")
        time.sleep(1)
        self.assertTrue(success_toast.is_displayed())

        #Get the table content and ensure 'test-user' is not present
        table = self.driver.find_element(By.XPATH, "//table")
        table_text = table.text
        assert "test-user" not in table_text

    def test_7edit_profile(self):
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
                                                                        
        updated_username_display = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div/main/div/div/div/div[2]/div[2]/form/div[1]/div[1]/div[contains(text(), 'newtestuser')]")
        self.assertTrue(updated_username_display.is_displayed())

        updated_email_display = self.driver.find_element(By.XPATH, "/html/body/div[1]/div/div/main/div/div/div/div[2]/div[2]/form/div[1]/div[2]/div[contains(text(), 'newtestuser@example.com')]")
        self.assertTrue(updated_email_display.is_displayed())

if __name__ == "__main__":
    unittest.main()

#Required Packages and Imports
import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Generate Course HTML : Not implemented
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Export Rules as JSON : Not implemeneted

class TestCourseManagePage(unittest.TestCase):

    @classmethod
    def setUp(cls):
        #WebDriver settings
        chrome_options = Options()
        # chrome_options.headless = True
        chrome_service = Service('/usr/bin/chromedriver')  
        cls.driver = webdriver.Chrome(service=chrome_service, options=chrome_options)
        cls.driver.maximize_window()
        cls.driver.implicitly_wait(10)
        #Assigning Base URL
        cls.base_url = "http://localhost:6014/generate-documents" 
        #Assigning login URL
        cls.login_url = "http://localhost:6014/login"  
        #Getting login URL
        cls.driver.get(cls.login_url)
        #Locating required fields and feeding data
        cls.driver.find_element(By.NAME, "email").send_keys("testuser@example.com")
        cls.driver.find_element(By.NAME, "password").send_keys("password123")
        cls.driver.find_element(By.TAG_NAME, "form").submit()
        time.sleep(1)
        #Getting Base URL
        cls.driver.get(cls.base_url)
        #Wait until Base URL is loaded
        WebDriverWait(cls.driver, 10).until(EC.url_contains(cls.base_url))

        #--Choosing Course
        #Locating Master of Music and clicking on it
        course_dropdown = cls.driver.find_element(By.XPATH, '/html/body/div[1]/div/main/div/div/div[1]/div/div[2]/div[1]/div[1]/button')
        course_dropdown.click()
        action = ActionChains(cls.driver)
        action.send_keys(Keys.ENTER).perform()
        wait = WebDriverWait(cls.driver, 5)

         #--Choosing Version
        #Locating 2024 and clicking on it
        version_dropdown = wait.until(EC.element_to_be_clickable((By.XPATH, "/html/body/div[1]/div/main/div/div/div[1]/div/div[2]/div[1]/div[2]/button")))
        version_dropdown.click()
        action.send_keys(Keys.ENTER).perform()

    @classmethod
    def tearDown(cls):
        cls.driver.quit()
    
    def test_pdf_generation(self):
        '''Test Course rules PDF generation'''
        #wait for button to appear
        GEN_PDF_button = WebDriverWait(self.driver, 5).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Generate Course PDF')]"))
        )

        #Clicking on Generate Course PDF
        GEN_PDF_button.click()
        
        #Clicking on Download PDF
        DOWN_PDF_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Download PDF')]"))
        )
        DOWN_PDF_button.click()

        #Waiting for the new tab to open
        WebDriverWait(self.driver, 10).until(EC.number_of_windows_to_be(2))

        #Storing the main window and new tab handles
        main_window = self.driver.current_window_handle
        new_window = [window for window in self.driver.window_handles if window != main_window][0]
        
        #Switching to the new tab
        self.driver.switch_to.window(new_window)

        #Asserting 
        assert "http://localhost:6015/public/pdf/course_87_rules.pdf" in self.driver.current_url, f"Expected URL not found. Found {self.driver.current_url} instead."

    def test_link_to_existing_handbook(self):
        '''Test redirection to UWA Handbook'''
        #Wait for button to appear
        HAND_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'Link to Full Handbook')]"))
        )

        #Clicking on Link to Full Handbook
        HAND_button.click()

        #Waiting for the new tab to open
        WebDriverWait(self.driver, 10).until(EC.number_of_windows_to_be(2))

        #Storing the main window and new tab handles
        main_window = self.driver.current_window_handle
        new_window = [window for window in self.driver.window_handles if window != main_window][0]
        
        #Switching to the new tab
        self.driver.switch_to.window(new_window)

        #Asserting 
        assert "https://handbooks.uwa.edu.au/coursedetails?code=10720#rules" in self.driver.current_url, f"Expected URL not found. Found {self.driver.current_url} instead."

if __name__ == "__main__":
    unittest.main()
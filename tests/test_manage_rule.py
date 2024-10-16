from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Set up WebDriver (assuming Chrome)
driver = webdriver.Chrome()

# Define URL of the web application
url = 'http://localhost:3000/manage-course'  # Update if necessary

# Navigate to the URL
driver.get(url)

# Set up explicit wait
wait = WebDriverWait(driver, 10)

# Wait for the Manage Rules page to load
wait.until(EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Manage Rules')]")))

# Test navigating to the Admission and Selection section
admission_section = wait.until(EC.element_to_be_clickable((By.XPATH, "//a[@href='#admission']")))
admission_section.click()

# Verify the Admission and Selection section is visible
admission_section_header = wait.until(
    EC.presence_of_element_located((By.XPATH, "//h2[contains(text(), 'Admission and selection')]"))
)
assert admission_section_header.is_displayed()

# Test navigating to the Course Structure section
course_structure_section = wait.until(EC.element_to_be_clickable((By.XPATH, "//a[@href='#course-structure']")))
course_structure_section.click()

# Verify the Course Structure section is visible
course_structure_header = wait.until(
    EC.presence_of_element_located((By.XPATH, "//h2[contains(text(), 'Course Structure')]"))
)
assert course_structure_header.is_displayed()

# Test filling in form data for Course Structure
course_structure_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Enter course structure']")))
course_structure_input.clear()
course_structure_input.send_keys('Updated Course Structure')

# Navigate to Deferrals section
deferrals_section = wait.until(EC.element_to_be_clickable((By.XPATH, "//a[@href='#deferrals']")))
deferrals_section.click()

# Verify the Deferrals section is visible
deferrals_header = wait.until(
    EC.presence_of_element_located((By.XPATH, "//h2[contains(text(), 'Deferrals')]"))
)
assert deferrals_header.is_displayed()

# Test toggling deferral allowed checkbox
deferral_checkbox = wait.until(EC.presence_of_element_located((By.ID, 'deferral-allowed-checkbox')))
deferral_checkbox.click()

# Test clicking the save button
save_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Save')]")))
save_button.click()

# Verify that the "Rules saved" toast message appears
toast_message = wait.until(EC.presence_of_element_located((By.XPATH, "//div[contains(text(), 'Rules saved')]")))
assert toast_message.is_displayed()

# Close the browser after the test
driver.quit()

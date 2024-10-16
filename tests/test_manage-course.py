from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Set up WebDriver (Make sure you have ChromeDriver or any browser driver installed)
driver = webdriver.Chrome()

# Define URL of the web application
url = 'http://localhost:3000/manage-course'  # Assuming it's running locally

# Navigate to the URL
driver.get(url)

# Wait for the page to load and locate the Create Course button
wait = WebDriverWait(driver, 10)
create_course_button = wait.until(
    EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Create New Course')]"))
)

# Click the Create Course button
create_course_button.click()

# Wait for the dialog to open and fill the form
wait.until(EC.presence_of_element_located((By.ID, 'code'))).send_keys('TEST100')
wait.until(EC.presence_of_element_located((By.ID, 'name'))).send_keys('Test Course')
wait.until(EC.presence_of_element_located((By.XPATH, "//input[@id='version']"))).send_keys('2024')

# Select Course Type from dropdown
course_type_dropdown = driver.find_element(By.XPATH, "//div[contains(@class, 'SelectTrigger')]")
course_type_dropdown.click()

course_type_option = wait.until(
    EC.element_to_be_clickable((By.XPATH, "//div[contains(text(), 'Master\'s (Coursework)')]"))
)
course_type_option.click()

# Submit the form
submit_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Create Course')]")
submit_button.click()

# Wait for the new course to appear in the table
wait.until(EC.presence_of_element_located((By.XPATH, "//td[contains(text(), 'TEST100')]")))

# Now perform a search operation
search_input = driver.find_element(By.XPATH, "//input[@placeholder='Search courses...']")
search_input.send_keys("Test Course")
search_input.send_keys(Keys.RETURN)

# Check if the search results contain the course
assert "Test Course" in driver.page_source

# Now, test deleting the course
delete_button = driver.find_element(By.XPATH, "//button[contains(@class, 'hover:bg-red-100')]")
delete_button.click()

# Confirm deletion in the dialog
confirm_delete_button = wait.until(
    EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Delete')]"))
)
confirm_delete_button.click()

# Wait for the course to be removed from the list
wait.until(EC.invisibility_of_element_located((By.XPATH, "//td[contains(text(), 'TEST100')]")))

# Close the browser after the test
driver.quit()

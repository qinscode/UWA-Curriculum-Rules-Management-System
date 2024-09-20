DELIMITER //

CREATE TRIGGER AfterInsertCourseLog
AFTER INSERT ON Courses
FOR EACH ROW
BEGIN
    CALL AddLogRecord(NEW.CourseID, 'Create', CONCAT('New course created: ', NEW.CourseName));
END //

DELIMITER ;


DELIMITER //

CREATE TRIGGER AfterUpdateCourseLog
AFTER UPDATE ON Courses
FOR EACH ROW
BEGIN
    CALL AddLogRecord(NEW.CourseID, 'Update', CONCAT('Course updated: ', NEW.CourseName));
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER BeforeDeleteUserLog
BEFORE DELETE ON Users
FOR EACH ROW
BEGIN
    CALL AddLogRecord(OLD.UserID, 'Delete', CONCAT('User deleted: ', OLD.Email));
END //

DELIMITER ;

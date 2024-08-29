DROP DATABASE IF EXISTS inflearn;

CREATE DATABASE inflearn DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

use inflearn;

CREATE TABLE instructor
(
  id     INT         NOT NULL AUTO_INCREMENT,
  name   VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE student
(
  id       INT         NOT NULL AUTO_INCREMENT,
  email    VARCHAR(50) NOT NULL UNIQUE,
  nickname VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE course
(
  id            INT         NOT NULL AUTO_INCREMENT,
  instructor_id INT         NOT NULL,
  is_public     BOOLEAN     NOT NULL DEFAULT FALSE,
  title         VARCHAR(50) NOT NULL UNIQUE,
  description   TEXT,
  price         INT         NOT NULL,
  category      VARCHAR(30) NOT NULL,
  student_count INT         NOT NULL DEFAULT 0,
  create_date   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_date   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT FK_instructor_TO_course FOREIGN KEY (instructor_id) REFERENCES instructor (id),
  INDEX idx_covering_course_create_order (create_date DESC, title, instructor_id, price, category, student_count, is_public),
  INDEX idx_covering_course_student_count_order (student_count DESC, create_date, title, instructor_id, price, category, is_public)
);

CREATE TABLE class
(
  id          INT      NOT NULL AUTO_INCREMENT,
  student_id  INT      NOT NULL,
  course_id   INT      NOT NULL,
  create_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT FK_student_TO_class FOREIGN KEY (student_id) REFERENCES student (id) ON DELETE CASCADE,
  CONSTRAINT FK_course_TO_class FOREIGN KEY (course_id) REFERENCES course (id) ON DELETE RESTRICT,
  INDEX idx_covering_course_id_student_id (course_id, student_id)
);

INSERT INTO instructor(name) VALUES ('향로');
INSERT INTO instructor(name) VALUES ('김영한');
INSERT INTO instructor(name) VALUES ('백기선');
INSERT INTO instructor(name) VALUES ('토비');
INSERT INTO instructor(name) VALUES ('JSCODE 박재성');
INSERT INTO instructor(name) VALUES ('호돌맨');
INSERT INTO instructor(name) VALUES ('널널한 개발자');
INSERT INTO instructor(name) VALUES ('큰돌');
INSERT INTO instructor(name) VALUES ('김영명');
-- Run in cPanel → phpMyAdmin (select your database first), or MySQL Databases.
CREATE TABLE IF NOT EXISTS inquiries (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  type        VARCHAR(32)  NOT NULL DEFAULT 'tour',
  name        VARCHAR(120) NOT NULL,
  phone       VARCHAR(40)  NOT NULL,
  email       VARCHAR(160),
  child_age   VARCHAR(40),
  message     TEXT,
  source      VARCHAR(40)  DEFAULT 'website',
  created_at  DATETIME     NOT NULL,
  INDEX (created_at), INDEX (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

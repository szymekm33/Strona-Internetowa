CREATE TABLE IF NOT EXISTS users (
    user_id TINYINT UNSIGNED PRIMARY KEY,
    login VARCHAR(24) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    failures INT NOT NULL DEFAULT 0,
    last_failure DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS calendars (
    calendar_id VARCHAR(12) PRIMARY KEY,
    name VARCHAR(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
INSERT IGNORE INTO calendars VALUES ('agh','AGH'),('ur','UR'),('uken','UKEN'),('plans','Plany ręczne'),('dates','Ważne daty');

CREATE TABLE IF NOT EXISTS calendar_settings (
    id TINYINT PRIMARY KEY,
    revision BIGINT NOT NULL DEFAULT 0,
    semester_end DATE NULL
) ENGINE=InnoDB;
INSERT IGNORE INTO calendar_settings (id) VALUES (1);

CREATE TABLE IF NOT EXISTS events (
    event_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    author_id TINYINT UNSIGNED NOT NULL,
    calendar_id VARCHAR(12) NOT NULL,
    title VARCHAR(90) NOT NULL,
    starts_at DATETIME NOT NULL,
    ends_at DATETIME NOT NULL,
    all_day BOOLEAN NOT NULL,
    zajmuje_czas BOOLEAN NOT NULL,
    important BOOLEAN NOT NULL DEFAULT FALSE,
    color CHAR(7) NOT NULL DEFAULT '',
    place VARCHAR(90) NOT NULL DEFAULT '',
    note VARCHAR(500) NOT NULL DEFAULT '',
    series CHAR(32) NULL,
    original_date DATE NULL,
    source_key CHAR(64) UNIQUE,
    course VARCHAR(160) NOT NULL DEFAULT '',
    course_type VARCHAR(80) NOT NULL DEFAULT '',
    INDEX (starts_at), INDEX (series, original_date),
    FOREIGN KEY (author_id) REFERENCES users(user_id),
    FOREIGN KEY (calendar_id) REFERENCES calendars(calendar_id),
    CHECK (ends_at > starts_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS event_participants (
    event_id INT UNSIGNED NOT NULL,
    user_id TINYINT UNSIGNED NOT NULL,
    PRIMARY KEY(event_id,user_id),
    FOREIGN KEY(event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS agh_choices (
    kind VARCHAR(8) NOT NULL,
    choice_key VARCHAR(160) NOT NULL,
    included BOOLEAN NOT NULL,
    PRIMARY KEY (kind, choice_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

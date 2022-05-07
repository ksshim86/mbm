CREATE TABLE bookmark (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, url TEXT NOT NULL, del_yn TEXT NOT NULL DEFAULT 'N');

INSERT INTO bookmark(name, url) VALUES ('google', 'https://google.com');
INSERT INTO bookmark(name, url) VALUES ('github', 'https://github.com');
INSERT INTO bookmark(name, url) VALUES ('youtube', 'https://youtube.com');

SELECT * FROM bookmark WHERE del_yn = 'N';
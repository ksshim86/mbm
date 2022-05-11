CREATE TABLE bookmark (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, url TEXT NOT NULL, del_yn TEXT NOT NULL DEFAULT 'N');

INSERT INTO bookmark(name, url) VALUES ('google', 'https://google.com');
INSERT INTO bookmark(name, url) VALUES ('github', 'https://github.com');
INSERT INTO bookmark(name, url) VALUES ('youtube', 'https://youtube.com');

SELECT * FROM bookmark WHERE del_yn = 'N';

CREATE TABLE favorite (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slide_count INTEGER NOT NULL,
  row_count INTEGER NOT NULL,
  col_count INTEGER NOT NULL,
  slide_interval INTEGER NOT NULL,
  del_yn TEXT NOT NULL DEFAULT 'N'
);

CREATE TABLE favorite_url (
  favorite_id INTEGER NOT NULL,
  idx INTEGER NOT NULL,
  tab TEXT NOT NULL,
  url TEXT NULL,
  bookmark_id INTEGER NULL,
  del_yn TEXT NOT NULL DEFAULT 'N',
  FOREIGN KEY(favorite_id) REFERENCES favorite(id)
);
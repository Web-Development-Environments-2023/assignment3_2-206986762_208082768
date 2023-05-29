CREATE DATABASE mydb
    DEFAULT CHARACTER SET = 'utf8mb4';


CREATE TABLE users (  
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL
);


CREATE TABLE favorite_recipes (  
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    PRIMARY KEY(recipe_id, user_id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);


CREATE TABLE last_viewed_recipes (
  user_id INT NOT NULL,
  recipe_id INT NOT NULL,
  date DATETIME NOT NULL,
  PRIMARY KEY (user_id, recipe_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE recipes (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  readyInMinutes INT NOT NULL,
  vegetarian BOOLEAN NOT NULL,
  vegan BOOLEAN NOT NULL,
  gluten BOOLEAN NOT NULL,
  servings INT NOT NULL,
  instructions TEXT NOT NULL,
  ingredients JSON NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE family_recipes (
  recipes_id INT NOT NULL PRIMARY KEY,
  owner VARCHAR(100) NULL,
  whenToPrepare VARCHAR(100) NULL,
  FOREIGN KEY (`recipes_id`) REFERENCES recipes (id)
);
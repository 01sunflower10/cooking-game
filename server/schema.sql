-- 食光机 数据库初始化脚本（只需运行一次）
-- 用法：见 setup-db.bat，或手动执行：
--   "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql" -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS shiguangji_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE shiguangji_db;

-- APP 专用账号（不用 root；密码与 server/config.json 保持一致）
CREATE USER IF NOT EXISTS 'shiguangji'@'localhost' IDENTIFIED BY 'Sgj#2026cook';
GRANT ALL PRIVILEGES ON shiguangji_db.* TO 'shiguangji'@'localhost';
FLUSH PRIVILEGES;

-- 收藏夹
CREATE TABLE IF NOT EXISTS favorites (
  recipe_id  INT PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 采购计划
CREATE TABLE IF NOT EXISTS shopping_plans (
  recipe_id  INT PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 采购清单勾选状态（某道菜的哪些食材已买）
CREATE TABLE IF NOT EXISTS shopping_plan_checked (
  recipe_id        INT NOT NULL,
  ingredient_index INT NOT NULL,
  PRIMARY KEY (recipe_id, ingredient_index)
) ENGINE=InnoDB;

-- 做饭时光轴（含评分与心得 = 做菜笔记）
CREATE TABLE IF NOT EXISTS cooking_log (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  recipe_id  INT NOT NULL,
  cook_date  DATE NOT NULL,
  rating     TINYINT DEFAULT 0,
  note       VARCHAR(500) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 自定义菜谱（第四组：用户上传，id 从 1000 起）
CREATE TABLE IF NOT EXISTS custom_recipes (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  cat        VARCHAR(30)  DEFAULT '家常菜',
  cuisine    VARCHAR(30)  DEFAULT '家常菜',
  time       VARCHAR(30)  DEFAULT '30 分钟',
  level      VARCHAR(10)  DEFAULT '简单',
  servings   VARCHAR(30)  DEFAULT '2 人份',
  flavor     VARCHAR(10)  DEFAULT '咸鲜',
  emoji      VARCHAR(16)  DEFAULT '📝',
  img        VARCHAR(255) DEFAULT NULL,
  ingredients TEXT,
  steps       TEXT,
  tips        TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Schema completo do PodWave
-- Ordem respeita as dependências de chave estrangeira (FK).

-- ==========================================================
-- Entidades principais
-- ==========================================================

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255) NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT NULL
);

CREATE TABLE podcasts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NULL,
  capa_url VARCHAR(255) NULL,
  criador_id INT NOT NULL,
  category_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (criador_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

CREATE TABLE episodes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  podcast_id INT NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NULL,
  audio_url VARCHAR(255) NOT NULL,
  duracao_segundos INT NULL,
  numero_episodio INT NULL,
  publicado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (podcast_id) REFERENCES podcasts(id) ON DELETE CASCADE
);

-- ==========================================================
-- Interação do usuário com podcasts/episódios
-- ==========================================================

CREATE TABLE follows (
  follower_id INT NOT NULL,
  creator_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (follower_id, creator_id),
  FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
  CHECK (follower_id <> creator_id)
);

CREATE TABLE favorites (
  user_id INT NOT NULL,
  episode_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, episode_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE
);

CREATE TABLE episode_likes (
  user_id INT NOT NULL,
  episode_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, episode_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE
);

CREATE TABLE listening_progress (
  user_id INT NOT NULL,
  episode_id INT NOT NULL,
  posicao_segundos INT NOT NULL DEFAULT 0,
  concluido BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, episode_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE
);

CREATE TABLE ratings (
  user_id INT NOT NULL,
  episode_id INT NOT NULL,
  nota TINYINT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, episode_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE,
  CHECK (nota BETWEEN 1 AND 5)
);

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  episode_id INT NOT NULL,
  texto TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE
);

-- ==========================================================
-- Interesses do usuário (temas)
-- ==========================================================

CREATE TABLE user_interests (
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, category_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

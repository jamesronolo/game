/*
SQLyog Ultimate v9.62 
MySQL - 5.6.37-log : Database - games
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`games` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `games`;

/*Table structure for table `assignments` */

DROP TABLE IF EXISTS `assignments`;

CREATE TABLE `assignments` (
  `id` varchar(255) NOT NULL,
  `teacher_id` varchar(255) DEFAULT NULL,
  `teacher_name` varchar(255) DEFAULT NULL,
  `class_id` varchar(255) DEFAULT NULL,
  `class_name` varchar(255) DEFAULT NULL,
  `question_set_id` varchar(255) DEFAULT NULL,
  `question_set_title` varchar(255) DEFAULT NULL,
  `game_slug` varchar(255) DEFAULT NULL,
  `game_name` varchar(255) DEFAULT NULL,
  `join_code` varchar(100) DEFAULT NULL,
  `due_date` varchar(100) DEFAULT NULL,
  `rewards_enabled` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `join_code` (`join_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `assignments` */

LOCK TABLES `assignments` WRITE;

insert  into `assignments`(`id`,`teacher_id`,`teacher_name`,`class_id`,`class_name`,`question_set_id`,`question_set_title`,`game_slug`,`game_name`,`join_code`,`due_date`,`rewards_enabled`,`created_at`) values ('asg-1','u-teacher-1','Mrs. Sarah Davis','cls-2b','Grade 3 - Room 2B','qs-1','Sight Words & Early Phonics','wheel-spin','Wheel Spin','FUN-7890','2026-08-10',1,'2026-07-28 08:00:00'),('asg-2','u-teacher-1','Mrs. Sarah Davis','cls-2b','Grade 3 - Room 2B','qs-2','Math Safari: Addition & Multiplication','ship-battle','Ship Battle','MATH-4321','2026-08-15',1,'2026-07-29 09:30:00');

UNLOCK TABLES;

/*Table structure for table `attempt_answers` */

DROP TABLE IF EXISTS `attempt_answers`;

CREATE TABLE `attempt_answers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `attempt_id` varchar(255) NOT NULL,
  `question_id` varchar(255) DEFAULT NULL,
  `question_prompt` text,
  `student_answer` text,
  `correct_answer` text,
  `is_correct` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `attempt_id` (`attempt_id`),
  CONSTRAINT `attempt_answers_ibfk_1` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

/*Data for the table `attempt_answers` */

LOCK TABLES `attempt_answers` WRITE;

insert  into `attempt_answers`(`id`,`attempt_id`,`question_id`,`question_prompt`,`student_answer`,`correct_answer`,`is_correct`) values (1,'att-1','q1-1','Which word means \"at the present time\"?','NOW','NOW',1),(2,'att-1','q1-2','What is the opposite of \"BEFORE\"?','AFTER','AFTER',1),(3,'att-1','q1-3','Read and spell the word for a shining star.','BRIGHT','BRIGHT',1),(4,'att-1','q1-4','The birds fly high in the ______.','SKY','SKY',1),(5,'att-1','q1-5','Which word rhymes with \"BEACH\"?','PEACH','PEACH',1),(6,'att-2','q1-1','Which word means \"at the present time\"?','NOW','NOW',1),(7,'att-2','q1-2','What is the opposite of \"BEFORE\"?','UNDER','AFTER',0),(8,'att-2','q1-3','Read and spell the word for a shining star.','BRIGHT','BRIGHT',1),(9,'att-2','q1-4','The birds fly high in the ______.','SKY','SKY',1),(10,'att-2','q1-5','Which word rhymes with \"BEACH\"?','PEACH','PEACH',1);

UNLOCK TABLES;

/*Table structure for table `attempts` */

DROP TABLE IF EXISTS `attempts`;

CREATE TABLE `attempts` (
  `id` varchar(255) NOT NULL,
  `assignment_id` varchar(255) DEFAULT NULL,
  `student_id` varchar(255) DEFAULT NULL,
  `student_name` varchar(255) DEFAULT NULL,
  `question_set_id` varchar(255) DEFAULT NULL,
  `question_set_title` varchar(255) DEFAULT NULL,
  `game_slug` varchar(255) DEFAULT NULL,
  `score` int(11) DEFAULT '0',
  `accuracy` int(11) DEFAULT '0',
  `total_questions` int(11) DEFAULT '0',
  `correct_count` int(11) DEFAULT '0',
  `completed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `attempts` */

LOCK TABLES `attempts` WRITE;

insert  into `attempts`(`id`,`assignment_id`,`student_id`,`student_name`,`question_set_id`,`question_set_title`,`game_slug`,`score`,`accuracy`,`total_questions`,`correct_count`,`completed_at`) values ('att-1','asg-1','u-student-1','Leo Martinez','qs-1','Sight Words & Early Phonics','wheel-spin',450,100,5,5,'2026-07-30 14:20:00'),('att-2','asg-1','u-student-2','Sophia Chen','qs-1','Sight Words & Early Phonics','wheel-spin',360,80,5,4,'2026-07-31 09:10:00');

UNLOCK TABLES;

/*Table structure for table `games` */

DROP TABLE IF EXISTS `games`;

CREATE TABLE `games` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `mechanic` varchar(255) DEFAULT NULL,
  `badge` varchar(100) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `min_grade` varchar(100) DEFAULT NULL,
  `icon_name` varchar(100) DEFAULT NULL,
  `gradient_bg` varchar(255) DEFAULT NULL,
  `accent_color` varchar(100) DEFAULT NULL,
  `image_url` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `games` */

LOCK TABLES `games` WRITE;

insert  into `games`(`id`,`name`,`slug`,`description`,`mechanic`,`badge`,`category`,`min_grade`,`icon_name`,`gradient_bg`,`accent_color`,`image_url`) values ('g-1','Wheel Spin','wheel-spin','Spin a colorful prize wheel to select questions, win points, and clear challenges!','Wheel Spin + Question Quiz','Popular','arcade','K - 8','PieChart','from-amber-500 to-rose-500','#f59e0b','/assets/images/wheel_spin_game_1785564142771.jpg'),('g-2','Ship Battle','ship-battle','Command a pirate ship! Fire naval cannons at enemy vessels by answering questions correctly.','Action Battle + Strategy','Action','arcade','1 - 8','Ship','from-blue-600 to-indigo-700','#2563eb','/assets/images/ship_battle_game_1785564155376.jpg'),('g-3','Alien Spelling','alien-spelling','Help friendly alien astronauts decode cosmic word signals and spell target vocab words!','Spelling & Phonics','Phonics','slp','K - 5','Rocket','from-purple-600 to-pink-600','#9333ea','/assets/images/alien_spelling_game_1785564167746.jpg'),('g-4','Crane Game','crane-game','Operate an arcade claw machine! Lower the claw to lift surprise reward boxes with right answers.','Arcade Physics','Fun','arcade','K - 6','Box','from-emerald-500 to-teal-700','#10b981','/assets/images/crane_game_cover_1785564180477.jpg'),('g-5','Magic Potions','magic-potions','Combine magical ingredients in a bubbling cauldron and transform magical creatures!','Matching & Sequencing','Creative','puzzle','K - 5','Sparkles','from-violet-600 to-fuchsia-600','#7c3aed','/assets/images/magic_potions_game_1785564196384.jpg'),('g-6','Flashcards','flashcards','Flip 3D cards, self-mark known vs unknown terms, and master vocabulary with spaced repetition.','Spaced Repetition Study','Study Tool','quiz','All Grades','Layers','from-sky-500 to-blue-600','#0284c7','/assets/images/flashcards_game_1785564211020.jpg'),('g-7','Roll & Read','roll-and-read','Roll 3D dice to pick questions or articulation targets to read aloud with built-in TTS assistance!','SLP & Phonics Reading','SLP Favorite','slp','PreK - 6','Dices','from-orange-500 to-amber-600','#ea580c','/assets/images/roll_and_read_game_1785564222038.jpg'),('g-8','Ocean Quest','ocean-quest','Submerge into deep waters! Dive down to unlock glowing sunken treasure chests on the ocean floor.','Exploration & Collection','Adventure','arcade','1 - 6','Waves','from-cyan-600 to-blue-800','#0891b2','/assets/images/ocean_quest_game_1785564235278.jpg');

UNLOCK TABLES;

/*Table structure for table `question_sets` */

DROP TABLE IF EXISTS `question_sets`;

CREATE TABLE `question_sets` (
  `id` varchar(255) NOT NULL,
  `owner_id` varchar(255) DEFAULT NULL,
  `owner_name` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `subject` varchar(255) DEFAULT NULL,
  `grade_level` varchar(100) DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT '1',
  `tags` text,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `question_sets` */

LOCK TABLES `question_sets` WRITE;

insert  into `question_sets`(`id`,`owner_id`,`owner_name`,`title`,`description`,`subject`,`grade_level`,`is_public`,`tags`,`created_at`,`updated_at`) values ('qs-1','u-teacher-1','Mrs. Sarah Davis','Sight Words & Early Phonics','Essential high-frequency sight words and phonetic vowel sounds for early readers.','Reading & Phonics','Grade 1 - 2',1,'[\"sight-words\",\"phonics\",\"reading\",\"slp\"]','2026-07-15 10:00:00','2026-07-20 14:30:00'),('qs-2','u-teacher-1','Mrs. Sarah Davis','Math Safari: Addition & Multiplication','Fun arithmetic mental math challenges featuring wild safari animals.','Mathematics','Grade 2 - 4',1,'[\"math\",\"addition\",\"multiplication\",\"mental-math\"]','2026-07-18 11:20:00','2026-07-22 09:15:00'),('qs-3','u-teacher-1','Mrs. Sarah Davis','SLP Articulation: \"R\" & \"S\" Sound Drills','Targeted speech-language therapy word list for speech clarity and articulation drills.','Speech Therapy (SLP)','All Grades',1,'[\"slp\",\"speech-therapy\",\"articulation\",\"phonics\"]','2026-07-20 08:00:00','2026-07-25 16:00:00'),('qs-4','u-teacher-1','Mrs. Sarah Davis','World Capitals & Geography','Identify countries, continents, and capital cities from around the globe.','Social Studies','Grade 3 - 6',1,'[\"geography\",\"capitals\",\"world\",\"social-studies\"]','2026-07-22 14:10:00','2026-07-28 11:00:00'),('qs-5','u-teacher-1','Mrs. Sarah Davis','Elementary Science: Planets & Animals','Explore the solar system, animal habitats, and plant lifecycles.','Science','Grade 2 - 5',1,'[\"science\",\"planets\",\"animals\",\"space\"]','2026-07-24 09:30:00','2026-07-29 10:15:00');

UNLOCK TABLES;

/*Table structure for table `questions` */

DROP TABLE IF EXISTS `questions`;

CREATE TABLE `questions` (
  `id` varchar(255) NOT NULL,
  `set_id` varchar(255) NOT NULL,
  `prompt_text` text NOT NULL,
  `answer` text NOT NULL,
  `options` text,
  `type` varchar(50) DEFAULT 'multiple_choice',
  `position` int(11) DEFAULT '1',
  `hint` text,
  PRIMARY KEY (`id`),
  KEY `set_id` (`set_id`),
  CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`set_id`) REFERENCES `question_sets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `questions` */

LOCK TABLES `questions` WRITE;

insert  into `questions`(`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) values ('q1-1','qs-1','Which word means \"at the present time\"?','NOW','[\"NOW\",\"HOW\",\"COW\",\"BOW\"]','multiple_choice',1,'Rhymes with cow'),('q1-2','qs-1','What is the opposite of \"BEFORE\"?','AFTER','[\"AFTER\",\"UNDER\",\"OVER\",\"NEVER\"]','multiple_choice',2,'Starts with letter A'),('q1-3','qs-1','Read and spell the word for a shining star in the sky.','BRIGHT','[\"BRIGHT\",\"LIGHT\",\"NIGHT\",\"FLIGHT\"]','multiple_choice',3,NULL),('q1-4','qs-1','Complete the sentence: \"The birds fly high in the ______.\"','SKY','[\"SKY\",\"TRY\",\"DRY\",\"FLY\"]','multiple_choice',4,NULL),('q1-5','qs-1','Which word rhymes with \"BEACH\"?','PEACH','[\"PEACH\",\"REACH\",\"TEACH\",\"ALL OF THESE\"]','multiple_choice',5,NULL),('q2-1','qs-2','What is 7 + 8?','15','[\"13\",\"14\",\"15\",\"16\"]','multiple_choice',1,NULL),('q2-2','qs-2','What is 6 × 4?','24','[\"20\",\"24\",\"28\",\"30\"]','multiple_choice',2,NULL),('q2-3','qs-2','If a cheetah runs 12 miles in the morning and 15 miles in the afternoon, how many total miles?','27','[\"25\",\"27\",\"29\",\"31\"]','multiple_choice',3,NULL),('q2-4','qs-2','What is 9 × 3?','27','[\"24\",\"27\",\"30\",\"36\"]','multiple_choice',4,NULL),('q2-5','qs-2','What is 45 ÷ 5?','9','[\"7\",\"8\",\"9\",\"10\"]','multiple_choice',5,NULL),('q3-1','qs-3','Pronounce aloud: \"RED ROCKET\"','RED ROCKET','[\"RED ROCKET\",\"BED LOCKET\",\"WED WOCKET\",\"RED LOCKET\"]','text',1,'Keep tongue tip curved back for initial R'),('q3-2','qs-3','Pronounce aloud: \"SUPER SUNSHINE\"','SUPER SUNSHINE','[\"SUPER SUNSHINE\",\"SHUPER SUNSHINE\",\"THUPER THUNTHINE\",\"SOUPER SUNSET\"]','text',2,'Light smile position, tongue behind front teeth for S'),('q3-3','qs-3','Spell and say: \"RABBIT RUNS FAST\"','RABBIT','[\"RABBIT\",\"RIVER\",\"ROBOT\",\"RING\"]','multiple_choice',3,NULL),('q3-4','qs-3','Say out loud: \"STARLIGHT SPARKLE\"','SPARKLE','[\"SPARKLE\",\"SILVER\",\"SMILE\",\"SPIDER\"]','multiple_choice',4,NULL),('q3-5','qs-3','Articulation blend: \"STRAWBERRY RAIN\"','STRAWBERRY','[\"STRAWBERRY\",\"RASPBERRY\",\"BLUEBERRY\",\"CHERRY\"]','multiple_choice',5,NULL),('q4-1','qs-4','What is the capital city of France?','PARIS','[\"PARIS\",\"LYON\",\"MARSEILLE\",\"NICE\"]','multiple_choice',1,NULL),('q4-2','qs-4','What is the capital city of Japan?','TOKYO','[\"KYOTO\",\"OSAKA\",\"TOKYO\",\"SAPPORO\"]','multiple_choice',2,NULL),('q4-3','qs-4','Which continent is home to the Amazon Rainforest?','SOUTH AMERICA','[\"AFRICA\",\"SOUTH AMERICA\",\"ASIA\",\"OCEANIA\"]','multiple_choice',3,NULL),('q4-4','qs-4','What is the largest ocean on Earth?','PACIFIC OCEAN','[\"ATLANTIC OCEAN\",\"INDIAN OCEAN\",\"PACIFIC OCEAN\",\"ARCTIC OCEAN\"]','multiple_choice',4,NULL),('q4-5','qs-4','What is the capital city of Canada?','OTTAWA','[\"TORONTO\",\"VANCOUVER\",\"MONTREAL\",\"OTTAWA\"]','multiple_choice',5,NULL),('q5-1','qs-5','Which planet is known as the Red Planet?','MARS','[\"VENUS\",\"MARS\",\"JUPITER\",\"SATURN\"]','multiple_choice',1,NULL),('q5-2','qs-5','What process do green plants use to convert sunlight into food?','PHOTOSYNTHESIS','[\"PHOTOSYNTHESIS\",\"RESPIRATION\",\"EVAPORATION\",\"FERMENTATION\"]','multiple_choice',2,NULL),('q5-3','qs-5','Which mammal is capable of true flight?','BAT','[\"FLYING SQUIRREL\",\"BAT\",\"PENGUIN\",\"OWL\"]','multiple_choice',3,NULL),('q5-4','qs-5','What is the largest planet in our Solar System?','JUPITER','[\"EARTH\",\"NEPTUNE\",\"SATURN\",\"JUPITER\"]','multiple_choice',4,NULL);

UNLOCK TABLES;

/*Table structure for table `rewards` */

DROP TABLE IF EXISTS `rewards`;

CREATE TABLE `rewards` (
  `student_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `points` int(11) DEFAULT '0',
  `tickets_earned` int(11) DEFAULT '0',
  `unlocked_sticker_ids` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `rewards` */

LOCK TABLES `rewards` WRITE;

insert  into `rewards`(`student_id`,`points`,`tickets_earned`,`unlocked_sticker_ids`) values ('u-student-1',450,2,'[\"stk-1\",\"stk-2\"]');

UNLOCK TABLES;

/*Table structure for table `roster` */

DROP TABLE IF EXISTS `roster`;

CREATE TABLE `roster` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stars` int(11) DEFAULT '0',
  `points` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `roster` */

LOCK TABLES `roster` WRITE;

insert  into `roster`(`id`,`name`,`avatar`,`stars`,`points`) values ('s1','Leo Martinez','?',12,450),('s2','Sophia Chen','?',15,520),('s3','Marcus Vance','?',9,310),('s4','Emma Watson','?',18,680),('s5','Jayden Brooks','?',14,490),('s6','Ava Patel','?',11,390),('s7','Noah Miller','?',16,580),('s8','Mia Taylor','?',13,440);

UNLOCK TABLES;

/*Table structure for table `stickers` */

DROP TABLE IF EXISTS `stickers`;

CREATE TABLE `stickers` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `rarity` varchar(100) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `emoji` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `stickers` */

LOCK TABLES `stickers` WRITE;

insert  into `stickers`(`id`,`name`,`rarity`,`category`,`emoji`,`description`) values ('stk-1','Cosmic Dino','Common','Space','?','Roars through the galaxy!'),('stk-10','Diamond Shield','Legendary','Power','?','Unstoppable streak defense!'),('stk-11','Magic Cauldron','Epic','Magic','?','Brewing genius ideas.'),('stk-12','Pirate Captain','Rare','Adventure','?‍☠️','Sails the high seas of math!'),('stk-2','Super Star','Common','Classroom','⭐','Shines bright for good work!'),('stk-3','Wizard Owl','Rare','Magic','?','Wise master of spell casting.'),('stk-4','Golden Trophy','Legendary','Achievements','?','Awarded to top champions!'),('stk-5','Rocket Ship','Rare','Space','?','Blasts off towards success!'),('stk-6','Brainy Fox','Common','Animals','?','Quick-thinking puzzle solver.'),('stk-7','Sparkle Unicorn','Epic','Fantasy','?','Magical powers of learning.'),('stk-8','Robo Pal','Rare','Sci-Fi','?','Beep boop! 100% correct answers.'),('stk-9','Ocean Dolphin','Common','Ocean','?','Dives deep into knowledge.');

UNLOCK TABLES;

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `is_pro` tinyint(1) DEFAULT '0',
  `avatar_url` text,
  `class_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `users` */

LOCK TABLES `users` WRITE;

insert  into `users`(`id`,`name`,`email`,`role`,`is_pro`,`avatar_url`,`class_name`,`created_at`) values ('u-parent-1','David Martinez','david.martinez@gmail.com','parent',0,'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',NULL,'2026-08-03 16:10:16'),('u-student-1','Leo Martinez','leo.m@student.edu','student',0,'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80','Grade 3 - Room 2B','2026-08-03 16:10:16'),('u-student-2','Sophia Chen','sophia.c@student.edu','student',0,'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80','Grade 3 - Room 2B','2026-08-03 16:10:16'),('u-teacher-1','Mrs. Sarah Davis','davis@elementary.edu','teacher',1,'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80','Grade 3 - Room 2B','2026-08-03 16:10:16');

UNLOCK TABLES;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

/* Insert 105 new questions for Algebra, Human Body, and Plant Science */
INSERT INTO `question_sets` (`id`,`owner_id`,`owner_name`,`title`,`description`,`subject`,`grade_level`,`is_public`,`tags`,`created_at`,`updated_at`) VALUES ('qs-6','u-teacher-1','Mrs. Sarah Davis','Basic Algebra Masterclass (35 Items)','Comprehensive algebra practice covering linear equations, variables, exponents, and expression simplification.','Mathematics','Grade 5 - 8',1,'["algebra","math","equations","variables","mastery"]','2026-08-01 08:00:00','2026-08-05 12:00:00');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q1','qs-6','Solve for x: x + 7 = 15','8','["6","7","8","9"]','multiple_choice',1,'Subtract 7 from both sides');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q2','qs-6','Solve for x: 3x = 21','7','["5","6","7","8"]','multiple_choice',2,'Divide both sides by 3');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q3','qs-6','Solve for y: 2y - 4 = 10','7','["5","6","7","8"]','multiple_choice',3,'Add 4 then divide by 2');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q4','qs-6','What is the value of 5x when x = 4?','20','["15","20","25","30"]','multiple_choice',4,'Multiply 5 by 4');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q5','qs-6','Simplify: 4a + 3a','7a','["7a","12a","7a²","12"]','multiple_choice',5,'Add the coefficients 4 + 3');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q6','qs-6','Solve for m: m / 4 = 6','24','["10","20","24","28"]','multiple_choice',6,'Multiply 6 by 4');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q7','qs-6','Evaluate: 2³ (2 to the power of 3)','8','["6","8","9","16"]','multiple_choice',7,'2 * 2 * 2');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q8','qs-6','Solve for n: n + 12 = 30','18','["16","18","20","22"]','multiple_choice',8,'Subtract 12 from 30');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q9','qs-6','What is the coefficient of x in the term 9x?','9','["x","9","1","9x"]','multiple_choice',9,'The number multiplying x');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q10','qs-6','Solve for x: 5x + 3 = 28','5','["4","5","6","7"]','multiple_choice',10,'5x = 25');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q11','qs-6','Simplify: 9y - 4y + 2y','7y','["5y","7y","11y","7"]','multiple_choice',11,'(9 - 4 + 2)y');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q12','qs-6','If p = 3 and q = 4, what is p * q + 2?','14','["12","14","16","18"]','multiple_choice',12,'3 * 4 + 2');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q13','qs-6','Solve for x: 4x = 32','8','["6","7","8","9"]','multiple_choice',13,'32 / 4');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q14','qs-6','Which expression represents "5 more than a number n"?','n + 5','["n + 5","5n","n - 5","5 / n"]','multiple_choice',14,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q15','qs-6','Solve for k: k - 9 = 15','24','["21","22","24","26"]','multiple_choice',15,'15 + 9');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q16','qs-6','What is the value of x² when x = 6?','36','["12","30","36","64"]','multiple_choice',16,'6 * 6');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q17','qs-6','Solve for x: 2x + 8 = 20','6','["4","5","6","7"]','multiple_choice',17,'2x = 12');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q18','qs-6','Simplify: 3(x + 4)','3x + 12','["3x + 4","3x + 12","7x","12x"]','multiple_choice',18,'Distribute 3 * x and 3 * 4');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q19','qs-6','Solve for y: y / 3 = 9','27','["12","18","24","27"]','multiple_choice',19,'9 * 3');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q20','qs-6','What is the perimeter of a square with side length s?','4s','["s²","4s","2s","s + 4"]','multiple_choice',20,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q21','qs-6','Solve for z: 10 - z = 4','6','["4","6","8","14"]','multiple_choice',21,'10 - 4');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q22','qs-6','If x = 2 and y = 5, what is 3x + 2y?','16','["14","16","18","20"]','multiple_choice',22,'3(2) + 2(5)');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q23','qs-6','Solve for x: 6x = 42','7','["6","7","8","9"]','multiple_choice',23,'42 / 6');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q24','qs-6','Simplify: 10k - 7k + k','4k','["3k","4k","5k","17k"]','multiple_choice',24,'(10 - 7 + 1)k');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q25','qs-6','Which inequality represents "x is greater than 8"?','x > 8','["x > 8","x < 8","x = 8","x ≥ 8"]','multiple_choice',25,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q26','qs-6','Solve for x: 3x + 5 = 20','5','["3","4","5","6"]','multiple_choice',26,'3x = 15');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q27','qs-6','What is 4³ (4 cubed)?','64','["12","16","64","81"]','multiple_choice',27,'4 * 4 * 4');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q28','qs-6','Solve for n: 2n + 10 = 26','8','["6","7","8","9"]','multiple_choice',28,'2n = 16');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q29','qs-6','Simplify: 5(2x - 3)','10x - 15','["10x - 3","10x - 15","7x - 15","10x + 15"]','multiple_choice',29,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q30','qs-6','Solve for b: b / 5 = 7','35','["25","30","35","40"]','multiple_choice',30,'7 * 5');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q31','qs-6','If a = 4, what is a² - 5?','11','["3","11","16","21"]','multiple_choice',31,'16 - 5');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q32','qs-6','Solve for x: 7x - 4 = 17','3','["2","3","4","5"]','multiple_choice',32,'7x = 21');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q33','qs-6','Which term is a constant in the expression 4x + 9?','9','["4x","4","x","9"]','multiple_choice',33,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q34','qs-6','Solve for x: x / 2 + 3 = 8','10','["8","10","12","14"]','multiple_choice',34,'x / 2 = 5');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-6-q35','qs-6','Evaluate 2x + y when x = 3 and y = 4','10','["9","10","11","12"]','multiple_choice',35,'2(3) + 4');
INSERT INTO `question_sets` (`id`,`owner_id`,`owner_name`,`title`,`description`,`subject`,`grade_level`,`is_public`,`tags`,`created_at`,`updated_at`) VALUES ('qs-7','u-teacher-1','Mrs. Sarah Davis','Human Body & Anatomy Science (35 Items)','Explore human body systems including bones, organs, muscles, blood circulation, and brain functions.','Science','Grade 4 - 8',1,'["science","anatomy","human-body","biology","organs"]','2026-08-01 08:00:00','2026-08-05 12:00:00');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q1','qs-7','How many bones are in the adult human body?','206','["150","206","300","350"]','multiple_choice',1,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q2','qs-7','Which organ pumps blood throughout the body?','HEART','["LUNGS","HEART","LIVER","BRAIN"]','multiple_choice',2,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q3','qs-7','What is the main gas absorbed by lungs during inhalation?','OXYGEN','["CARBON DIOXIDE","NITROGEN","OXYGEN","HYDROGEN"]','multiple_choice',3,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q4','qs-7','Which organ controls thought, memory, and emotion?','BRAIN','["HEART","BRAIN","STOMACH","SPINE"]','multiple_choice',4,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q5','qs-7','What is the hardest substance in the human body?','TOOTH ENAMEL','["BONE","TOOTH ENAMEL","CARTILAGE","SKULL"]','multiple_choice',5,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q6','qs-7','Which body system helps defend against germs and infections?','IMMUNE SYSTEM','["DIGESTIVE SYSTEM","IMMUNE SYSTEM","SKELETAL SYSTEM","MUSCULAR SYSTEM"]','multiple_choice',6,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q7','qs-7','Where does most food digestion and nutrient absorption occur?','SMALL INTESTINE','["STOMACH","SMALL INTESTINE","LARGE INTESTINE","ESOPHAGUS"]','multiple_choice',7,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q8','qs-7','What carries oxygenated blood away from the heart?','ARTERIES','["VEINS","ARTERIES","CAPILLARIES","NERVES"]','multiple_choice',8,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q9','qs-7','Which pigment gives human skin and hair its color?','MELANIN','["KERATIN","MELANIN","HEMOGLOBIN","CAROTENE"]','multiple_choice',9,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q10','qs-7','How many chambers does the human heart have?','4','["2","3","4","6"]','multiple_choice',10,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q11','qs-7','What type of joint is found at the shoulder and hip?','BALL AND SOCKET','["HINGE","BALL AND SOCKET","PIVOT","FIXED"]','multiple_choice',11,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q12','qs-7','Which organ filters waste products from blood to produce urine?','KIDNEYS','["LIVER","KIDNEYS","SPLEEN","PANCREAS"]','multiple_choice',12,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q13','qs-7','What protein in red blood cells binds to oxygen?','HEMOGLOBIN','["INSULIN","HEMOGLOBIN","COLLAGEN","FIBRIN"]','multiple_choice',13,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q14','qs-7','What connects muscles to bones?','TENDONS','["LIGAMENTS","TENDONS","CARTILAGE","NERVES"]','multiple_choice',14,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q15','qs-7','What connects bones to other bones at joints?','LIGAMENTS','["TENDONS","LIGAMENTS","VEINS","MUSCLES"]','multiple_choice',15,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q16','qs-7','Which organ produces insulin to regulate blood sugar levels?','PANCREAS','["LIVER","PANCREAS","STOMACH","GALLBLADDER"]','multiple_choice',16,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q17','qs-7','What is the largest organ of the human body?','SKIN','["LIVER","SKIN","BRAIN","LUNGS"]','multiple_choice',17,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q18','qs-7','Which part of the brain controls balance and movement coordination?','CEREBELLUM','["CEREBRUM","CEREBELLUM","BRAIN STEM","HYPOTHALAMUS"]','multiple_choice',18,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q19','qs-7','What muscle contracts down to pull air into the lungs?','DIAPHRAGM','["BICEP","DIAPHRAGM","ABS","INTERCOSTAL"]','multiple_choice',19,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q20','qs-7','Which blood vessels carry blood back towards the heart?','VEINS','["ARTERIES","VEINS","CAPILLARIES","AORTA"]','multiple_choice',20,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q21','qs-7','What tiny air sacs in lungs exchange oxygen and carbon dioxide?','ALVEOLI','["BRONCHI","ALVEOLI","TRACHEA","LARYNX"]','multiple_choice',21,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q22','qs-7','What protects the brain inside the skull?','CRANIUM','["FEMUR","CRANIUM","RIBCAGE","STERNUM"]','multiple_choice',22,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q23','qs-7','What acid in the stomach helps digest food?','HYDROCHLORIC ACID','["CITRIC ACID","HYDROCHLORIC ACID","LACTIC ACID","ACETIC ACID"]','multiple_choice',23,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q24','qs-7','Which cells in the blood help form clots to stop bleeding?','PLATELETS','["RED BLOOD CELLS","WHITE BLOOD CELLS","PLATELETS","PLASMA"]','multiple_choice',24,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q25','qs-7','What is the longest bone in the human body?','FEMUR','["TIBIA","FEMUR","HUMERUS","RADIUS"]','multiple_choice',25,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q26','qs-7','What is the primary function of white blood cells?','FIGHT INFECTION','["CARRY OXYGEN","FIGHT INFECTION","DIGEST FOOD","PUMP BLOOD"]','multiple_choice',26,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q27','qs-7','Which body system controls hormones and metabolism?','ENDOCRINE SYSTEM','["NERVOUS SYSTEM","ENDOCRINE SYSTEM","LYMPHATIC SYSTEM","SKELETAL SYSTEM"]','multiple_choice',27,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q28','qs-7','What clear fluid protects the spinal cord and brain?','CEREBROSPINAL FLUID','["PLASMA","CEREBROSPINAL FLUID","LYMPH","SALIVA"]','multiple_choice',28,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q29','qs-7','How many teeth does a full set of adult human teeth contain?','32','["20","28","32","36"]','multiple_choice',29,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q30','qs-7','What is the voice box in the throat called?','LARYNX','["PHARYNX","LARYNX","TRACHEA","ESOPHAGUS"]','multiple_choice',30,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q31','qs-7','Which bone protects the heart and lungs?','RIBCAGE','["PELVIS","RIBCAGE","SKULL","SPINE"]','multiple_choice',31,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q32','qs-7','What digestive organ produces bile to digest fats?','LIVER','["LIVER","STOMACH","PANCREAS","SPLEEN"]','multiple_choice',32,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q33','qs-7','What is the electrical signal carrier cell in the nervous system?','NEURON','["NEURON","NEPHRON","LEUKOCYTE","MYOCYTE"]','multiple_choice',33,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q34','qs-7','What part of the eye controls the amount of light entering?','IRIS','["RETINA","CORNEA","IRIS","LENS"]','multiple_choice',34,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-7-q35','qs-7','Which type of muscle moves automatically without conscious thought?','INVOLUNTARY MUSCLE','["VOLUNTARY MUSCLE","INVOLUNTARY MUSCLE","SKELETAL MUSCLE","TENDON"]','multiple_choice',35,NULL);
INSERT INTO `question_sets` (`id`,`owner_id`,`owner_name`,`title`,`description`,`subject`,`grade_level`,`is_public`,`tags`,`created_at`,`updated_at`) VALUES ('qs-8','u-teacher-1','Mrs. Sarah Davis','Plant Biology & Botany (35 Items)','Deep dive into plant structures, photosynthesis, cell walls, xylem/phloem, pollination, and germination.','Science','Grade 3 - 8',1,'["science","botany","plants","photosynthesis","biology"]','2026-08-01 08:00:00','2026-08-05 12:00:00');
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q1','qs-8','What process do green plants use to convert sunlight into food energy?','PHOTOSYNTHESIS','["PHOTOSYNTHESIS","RESPIRATION","TRANSPIRATION","GERMINATION"]','multiple_choice',1,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q2','qs-8','What green pigment in plant leaves absorbs sunlight?','CHLOROPHYLL','["CAROTENE","CHLOROPHYLL","MELANIN","XANTHOPHYLL"]','multiple_choice',2,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q3','qs-8','Which plant organ absorbs water and minerals from the soil?','ROOTS','["LEAVES","STEM","ROOTS","FLOWERS"]','multiple_choice',3,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q4','qs-8','What gas do plants absorb from the air for photosynthesis?','CARBON DIOXIDE','["OXYGEN","CARBON DIOXIDE","NITROGEN","ARGON"]','multiple_choice',4,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q5','qs-8','What gas is released by plants as a byproduct of photosynthesis?','OXYGEN','["OXYGEN","CARBON DIOXIDE","METHANE","HYDROGEN"]','multiple_choice',5,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q6','qs-8','What plant tissue transports water from roots to leaves?','XYLEM','["PHLOEM","XYLEM","EPIDERMIS","STOMATA"]','multiple_choice',6,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q7','qs-8','What plant tissue transports synthesized sugars and nutrients?','PHLOEM','["XYLEM","PHLOEM","CAMBIUM","ROOT HAIR"]','multiple_choice',7,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q8','qs-8','What are the microscopic pores on leaves that allow gas exchange?','STOMATA','["STOMATA","CHLOROPLASTS","CUTICLES","VASCULAR BUNDLES"]','multiple_choice',8,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q9','qs-8','What organelle in plant cells carries out photosynthesis?','CHLOROPLAST','["MITOCHONDRIA","CHLOROPLAST","NUCLEUS","VACUOLE"]','multiple_choice',9,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q10','qs-8','What rigid outer layer gives plant cells structural support?','CELL WALL','["CELL MEMBRANE","CELL WALL","CYTOSKELETON","CAPSULE"]','multiple_choice',10,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q11','qs-8','What is the process of a seed sprouting into a young seedling?','GERMINATION','["POLLINATION","GERMINATION","FERTILIZATION","TRANSPIRATION"]','multiple_choice',11,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q12','qs-8','Which male flower part produces pollen grains?','ANTHER','["STIGMA","ANTHER","PETAL","OVARY"]','multiple_choice',12,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q13','qs-8','Which female flower part receives pollen during pollination?','STIGMA','["STIGMA","ANTHER","FILAMENT","SEPAL"]','multiple_choice',13,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q14','qs-8','What process transfers pollen from anther to stigma?','POLLINATION','["GERMINATION","POLLINATION","PHOTOSYNTHESIS","ABSORPTION"]','multiple_choice',14,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q15','qs-8','What part of the flower develops into a fruit after fertilization?','OVARY','["PETAL","OVARY","SEPAL","STIGMA"]','multiple_choice',15,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q16','qs-8','What is the main food molecule produced by photosynthesis?','GLUCOSE','["SUCROSE","GLUCOSE","STARCH","CELLULOSE"]','multiple_choice',16,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q17','qs-8','What is the evaporation of water vapor from plant leaves called?','TRANSPIRATION','["EVAPORATION","TRANSPIRATION","CONDENSATION","RESPIRATION"]','multiple_choice',17,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q18','qs-8','Which colorful flower parts attract pollinators like bees?','PETALS','["SEPALS","PETALS","STALKS","ROOTS"]','multiple_choice',18,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q19','qs-8','What protective outer layer covers green leaves to prevent water loss?','CUTICLE','["EPIDERMIS","CUTICLE","STOMATA","PHLOEM"]','multiple_choice',19,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q20','qs-8','What plant response causes roots to grow downward toward gravity?','GEOTROPISM','["PHOTOTROPISM","GEOTROPISM","HYDROTROPISM","THIGMOTROPISM"]','multiple_choice',20,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q21','qs-8','What plant growth movement responds toward a light source?','PHOTOTROPISM','["PHOTOTROPISM","GEOTROPISM","GRAVITROPISM","HYDROTROPISM"]','multiple_choice',21,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q22','qs-8','Which type of plants produce seeds enclosed within fruits?','ANGIOSPERMS','["GYMNOSPERMS","ANGIOSPERMS","MOSSES","FERNS"]','multiple_choice',22,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q23','qs-8','Which type of plants produce seeds in cones (like pine trees)?','GYMNOSPERMS','["ANGIOSPERMS","GYMNOSPERMS","ALGAE","MOSSES"]','multiple_choice',23,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q24','qs-8','What carbohydrate stored in plant roots serves as long-term energy reserve?','STARCH','["GLUCOSE","STARCH","FRUCTOSE","CELLULOSE"]','multiple_choice',24,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q25','qs-8','What organelle in plant cells stores water and maintains cell turgor pressure?','VACUOLE','["VACUOLE","CHLOROPLAST","NUCLEUS","GOLGI BODY"]','multiple_choice',25,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q26','qs-8','What non-flowering vascular plants reproduce using spores instead of seeds?','FERNS','["ROSES","FERNS","CONIFERS","ORCHIDS"]','multiple_choice',26,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q27','qs-8','What plant hormone promotes cell elongation and growth toward light?','AUXIN','["ETHYLENE","AUXIN","GIBBERELLIN","CYTOKININ"]','multiple_choice',27,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q28','qs-8','What gas hormone causes fruits like bananas to ripen?','ETHYLENE','["AUXIN","ETHYLENE","METHANE","OXYGEN"]','multiple_choice',28,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q29','qs-8','What structural polysaccharide forms the primary component of plant cell walls?','CELLULOSE','["STARCH","CELLULOSE","GLYCOGEN","CHITIN"]','multiple_choice',29,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q30','qs-8','Which plant part anchors the plant and absorbs water?','ROOT SYSTEM','["SHOOT SYSTEM","ROOT SYSTEM","CANOPY","FLOWER"]','multiple_choice',30,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q31','qs-8','What specialized cells open and close stomata pores?','GUARD CELLS','["GUARD CELLS","EPIDERMAL CELLS","XYLEM CELLS","CAMBIUM CELLS"]','multiple_choice',31,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q32','qs-8','What green non-vascular plants lack true roots, stems, and leaves?','MOSSES','["FERNS","MOSSES","PINES","PALMS"]','multiple_choice',32,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q33','qs-8','What stage of plant cellular respiration breaks down glucose to release ATP energy?','CELLULAR RESPIRATION','["PHOTOSYNTHESIS","CELLULAR RESPIRATION","FERMENTATION","TRANSPIRATION"]','multiple_choice',33,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q34','qs-8','What chemical equation balances photosynthesis?','CO2 + H2O + SUNLIGHT -> GLUCOSE + O2','["CO2 + H2O + SUNLIGHT -> GLUCOSE + O2","O2 + GLUCOSE -> CO2 + H2O","H2O + O2 -> CO2","SUGAR + AIR -> OXYGEN"]','multiple_choice',34,NULL);
INSERT INTO `questions` (`id`,`set_id`,`prompt_text`,`answer`,`options`,`type`,`position`,`hint`) VALUES ('qs-8-q35','qs-8','What protective green leaf-like structures enclose a flower bud before it opens?','SEPALS','["PETALS","SEPALS","STAMENS","PISTILS"]','multiple_choice',35,NULL);

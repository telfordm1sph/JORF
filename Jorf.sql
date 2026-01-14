-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: jorf_system
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `jorf_attachments`
--

DROP TABLE IF EXISTS `jorf_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jorf_attachments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jorf_id` varchar(150) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `file_size` bigint DEFAULT NULL,
  `file_type` varchar(150) DEFAULT NULL,
  `uploaded_by` varchar(100) DEFAULT NULL,
  `uploaded_at` datetime DEFAULT NULL,
  `deletad_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jorf_attachments`
--

LOCK TABLES `jorf_attachments` WRITE;
/*!40000 ALTER TABLE `jorf_attachments` DISABLE KEYS */;
INSERT INTO `jorf_attachments` VALUES (1,'JORF-2026-001','pexels-matreding-31173342.jpg','jorf_attachments/751/JORF-2026-001/LeFAW8rGSJB76nfckFX5XGA6iBcfBlMjDrCqwGO5.jpg',1643325,'image/jpeg','751','2026-01-13 13:20:51',NULL);
/*!40000 ALTER TABLE `jorf_attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jorf_logs`
--

DROP TABLE IF EXISTS `jorf_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jorf_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `loggable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `loggable_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `metadata` json DEFAULT NULL,
  `related_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `related_id` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jorf_logs`
--

LOCK TABLES `jorf_logs` WRITE;
/*!40000 ALTER TABLE `jorf_logs` DISABLE KEYS */;
INSERT INTO `jorf_logs` VALUES (1,'App\\Models\\Jorf','JORF-2026-001','CREATED','751','2026-01-13 05:20:51',NULL,'{\"id\": 1, \"status\": 1, \"details\": \"Sample request details wall repair\", \"empname\": \"Ungson, Leila B.\", \"jorf_id\": \"JORF-2026-001\", \"station\": \"MIS\", \"employid\": \"751\", \"prodline\": \"G & A\", \"created_at\": \"2026-01-13 13:20:51\", \"department\": \"MIS\", \"updated_at\": \"2026-01-13 13:20:51\", \"request_type\": \"Wall Repair\"}',NULL,NULL,NULL,NULL,'2026-01-13 05:20:51','2026-01-13 05:20:51'),(2,'App\\Models\\Jorf','JORF-2026-001','APPROVE','1694','2026-01-13 05:26:59','{\"status\": \"1\", \"remarks\": null}','{\"status\": 2, \"remarks\": \"Sample new flow\"}',NULL,NULL,NULL,NULL,'2026-01-13 05:26:59','2026-01-13 05:26:59'),(3,'App\\Models\\Jorf','JORF-2026-001','ONGOING','1161','2026-01-13 06:14:04','{\"status\": \"2\", \"remarks\": \"Sample new flow\", \"handled_at\": null, \"handled_by\": null, \"cost_amount\": null}','{\"status\": 3, \"remarks\": \"TEst Assign\", \"handled_at\": \"2026-01-13 14:14:04\", \"handled_by\": \"1014,19113\", \"cost_amount\": 1500}',NULL,NULL,NULL,NULL,'2026-01-13 06:14:04','2026-01-13 06:14:04'),(4,'App\\Models\\Jorf','JORF-2026-001','DONE','1014','2026-01-13 06:24:47','{\"status\": \"3\", \"remarks\": \"TEst Assign\", \"handled_at\": \"2026-01-13 14:14:04\"}','{\"status\": 4, \"remarks\": \"Done Fixing wall\", \"handled_at\": \"2026-01-13 14:24:47\"}',NULL,NULL,NULL,NULL,'2026-01-13 06:24:47','2026-01-13 06:24:47'),(5,'App\\Models\\Jorf','JORF-2026-001','ACKNOWLEDGE','751','2026-01-13 06:25:45','{\"rating\": null, \"status\": \"4\", \"remarks\": \"Done Fixing wall\"}','{\"rating\": 3.5, \"status\": 5, \"remarks\": \"Done Checking\"}',NULL,NULL,NULL,NULL,'2026-01-13 06:25:45','2026-01-13 06:25:45');
/*!40000 ALTER TABLE `jorf_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jorf_table`
--

DROP TABLE IF EXISTS `jorf_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jorf_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jorf_id` varchar(150) DEFAULT NULL,
  `employid` varchar(50) DEFAULT NULL,
  `empname` varchar(150) DEFAULT NULL,
  `department` varchar(150) DEFAULT NULL,
  `prodline` varchar(150) DEFAULT NULL,
  `station` varchar(150) DEFAULT NULL,
  `request_type` varchar(150) DEFAULT NULL,
  `details` longtext,
  `remarks` longtext,
  `status` varchar(100) DEFAULT NULL,
  `cost_amount` double DEFAULT NULL,
  `rating` double DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `handled_at` datetime DEFAULT NULL,
  `handled_by` varchar(250) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jorf_table`
--

LOCK TABLES `jorf_table` WRITE;
/*!40000 ALTER TABLE `jorf_table` DISABLE KEYS */;
INSERT INTO `jorf_table` VALUES (1,'JORF-2026-001','751','Ungson, Leila B.','MIS','G & A','MIS','Wall Repair','Sample request details wall repair','Done Checking','5',1500,3.5,'2026-01-13 13:20:51',NULL,'2026-01-13 14:24:47','1014,19113','2026-01-13 14:25:45',NULL);
/*!40000 ALTER TABLE `jorf_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_users`
--

DROP TABLE IF EXISTS `notification_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_users` (
  `emp_id` varchar(255) NOT NULL,
  `emp_name` varchar(255) DEFAULT NULL,
  `emp_dept` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`emp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_users`
--

LOCK TABLES `notification_users` WRITE;
/*!40000 ALTER TABLE `notification_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `notifiable_type` varchar(255) NOT NULL,
  `notifiable_id` bigint unsigned NOT NULL,
  `data` text NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type_of_request`
--

DROP TABLE IF EXISTS `type_of_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type_of_request` (
  `id` int NOT NULL AUTO_INCREMENT,
  `request_name` varchar(500) DEFAULT NULL,
  `is_active` int DEFAULT NULL,
  `created_by` varchar(150) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_by` varchar(150) DEFAULT NULL,
  `updated_at` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type_of_request`
--

LOCK TABLES `type_of_request` WRITE;
/*!40000 ALTER TABLE `type_of_request` DISABLE KEYS */;
INSERT INTO `type_of_request` VALUES (1,'Wall Repair',1,NULL,NULL,NULL,NULL),(2,'Replacement of Tile',1,NULL,NULL,NULL,NULL),(3,'Repainting of Doors/Wall',1,NULL,NULL,NULL,NULL),(4,'Door Repair',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `type_of_request` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-14 10:07:30

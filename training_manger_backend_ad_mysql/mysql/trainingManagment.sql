CREATE DATABASE  IF NOT EXISTS `training_managment` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `training_managment`;
-- MySQL dump 10.13  Distrib 8.0.12, for Win64 (x86_64)
--
-- Host: localhost    Database: training_managment
-- ------------------------------------------------------
-- Server version	8.0.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clusters`
--

DROP TABLE IF EXISTS `clusters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `clusters` (
  `idCluster` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idCluster`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clusters`
--

LOCK TABLES `clusters` WRITE;
/*!40000 ALTER TABLE `clusters` DISABLE KEYS */;
INSERT INTO `clusters` VALUES (1,'Windows'),(2,'Linux');
/*!40000 ALTER TABLE `clusters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `providers`
--

DROP TABLE IF EXISTS `providers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `providers` (
  `idProvider` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idProvider`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `providers`
--

LOCK TABLES `providers` WRITE;
/*!40000 ALTER TABLE `providers` DISABLE KEYS */;
INSERT INTO `providers` VALUES (1,'GOPAS');
/*!40000 ALTER TABLE `providers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `roles` (
  `idRole` int(11) NOT NULL AUTO_INCREMENT,
  `role` enum('User','Admin','Approver1','Approver2','Approver3','Procurement') DEFAULT 'User',
  PRIMARY KEY (`idRole`),
  UNIQUE KEY `name_UNIQUE` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (5,'User'),(6,'Admin'),(8,'Approver1'),(9,'Approver2'),(10,'Approver3'),(7,'Procurement');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainings`
--

DROP TABLE IF EXISTS `trainings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `trainings` (
  `idTraining` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idTraining`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainings`
--

LOCK TABLES `trainings` WRITE;
/*!40000 ALTER TABLE `trainings` DISABLE KEYS */;
INSERT INTO `trainings` VALUES (1,'training1'),(2,'training2');
/*!40000 ALTER TABLE `trainings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainings_has_clusters`
--

DROP TABLE IF EXISTS `trainings_has_clusters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `trainings_has_clusters` (
  `idTraining` int(11) NOT NULL,
  `idCluster` int(11) NOT NULL,
  PRIMARY KEY (`idTraining`,`idCluster`),
  KEY `fk_Trainings_has_Clusters_Clusters1_idx` (`idCluster`),
  KEY `fk_Trainings_has_Clusters_Trainings1_idx` (`idTraining`),
  CONSTRAINT `fk_Trainings_has_Clusters_Clusters1` FOREIGN KEY (`idCluster`) REFERENCES `clusters` (`idcluster`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Trainings_has_Clusters_Trainings1` FOREIGN KEY (`idTraining`) REFERENCES `trainings` (`idtraining`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainings_has_clusters`
--

LOCK TABLES `trainings_has_clusters` WRITE;
/*!40000 ALTER TABLE `trainings_has_clusters` DISABLE KEYS */;
INSERT INTO `trainings_has_clusters` VALUES (1,1),(2,2);
/*!40000 ALTER TABLE `trainings_has_clusters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainings_has_providers`
--

DROP TABLE IF EXISTS `trainings_has_providers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `trainings_has_providers` (
  `idTraining` int(11) NOT NULL,
  `idProvider` int(11) NOT NULL,
  `Price` int(11) DEFAULT NULL,
  PRIMARY KEY (`idTraining`,`idProvider`),
  KEY `fk_Trainings_has_Providers_Providers1_idx` (`idProvider`),
  KEY `fk_Trainings_has_Providers_Trainings1_idx` (`idTraining`),
  CONSTRAINT `fk_Trainings_has_Providers_Providers1` FOREIGN KEY (`idProvider`) REFERENCES `providers` (`idprovider`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Trainings_has_Providers_Trainings1` FOREIGN KEY (`idTraining`) REFERENCES `trainings` (`idtraining`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainings_has_providers`
--

LOCK TABLES `trainings_has_providers` WRITE;
/*!40000 ALTER TABLE `trainings_has_providers` DISABLE KEYS */;
INSERT INTO `trainings_has_providers` VALUES (1,1,150),(2,1,120);
/*!40000 ALTER TABLE `trainings_has_providers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_has_role`
--

DROP TABLE IF EXISTS `user_has_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user_has_role` (
  `idUser` int(11) NOT NULL,
  `idRole` int(11) NOT NULL,
  PRIMARY KEY (`idUser`,`idRole`),
  KEY `fk_User_has_Role_Role1_idx` (`idRole`),
  KEY `fk_User_has_Role_User1_idx` (`idUser`),
  CONSTRAINT `fk_User_has_Role_Role1` FOREIGN KEY (`idRole`) REFERENCES `roles` (`idRole`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_User_has_Role_User1` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_has_role`
--

LOCK TABLES `user_has_role` WRITE;
/*!40000 ALTER TABLE `user_has_role` DISABLE KEYS */;
INSERT INTO `user_has_role` VALUES (13,5),(14,6),(18,7),(15,8),(16,9),(17,10);
/*!40000 ALTER TABLE `user_has_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_has_substitute`
--

DROP TABLE IF EXISTS `user_has_substitute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user_has_substitute` (
  `idUser` int(11) NOT NULL,
  `idSubstitute` int(11) NOT NULL,
  PRIMARY KEY (`idUser`,`idSubstitute`),
  KEY `fk_Users_has_Users_Users2_idx` (`idSubstitute`),
  KEY `fk_Users_has_Users_Users1_idx` (`idUser`),
  CONSTRAINT `fk_Users_has_Users_Users1` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Users_has_Users_Users2` FOREIGN KEY (`idSubstitute`) REFERENCES `users` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_has_substitute`
--

LOCK TABLES `user_has_substitute` WRITE;
/*!40000 ALTER TABLE `user_has_substitute` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_has_substitute` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_has_training`
--

DROP TABLE IF EXISTS `user_has_training`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user_has_training` (
  `idUser` int(11) NOT NULL,
  `idTraining` int(11) NOT NULL,
  `idProvider` int(11) NOT NULL,
  `idCluster` int(11) NOT NULL,
  `trainingStatus` enum('pending approval') DEFAULT NULL,
  PRIMARY KEY (`idUser`,`idTraining`,`idProvider`,`idCluster`),
  KEY `fk_User_has_Training_Training1_idx` (`idTraining`),
  KEY `fk_User_has_Training_User1_idx` (`idUser`),
  KEY `fk_User_has_Training_Providers1_idx` (`idProvider`),
  KEY `fk_User_has_Training_Clusters1_idx` (`idCluster`),
  CONSTRAINT `fk_User_has_Training_Clusters1` FOREIGN KEY (`idCluster`) REFERENCES `clusters` (`idcluster`),
  CONSTRAINT `fk_User_has_Training_Providers1` FOREIGN KEY (`idProvider`) REFERENCES `providers` (`idprovider`),
  CONSTRAINT `fk_User_has_Training_Training1` FOREIGN KEY (`idTraining`) REFERENCES `trainings` (`idtraining`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_User_has_Training_User1` FOREIGN KEY (`idUser`) REFERENCES `users` (`iduser`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_has_training`
--

LOCK TABLES `user_has_training` WRITE;
/*!40000 ALTER TABLE `user_has_training` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_has_training` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `idUser` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `idBoss` int(11) DEFAULT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `fk_User_User1_idx` (`idBoss`),
  CONSTRAINT `fk_User_User1` FOREIGN KEY (`idBoss`) REFERENCES `users` (`idUser`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (13,'user','user','user','user@user.sk','$2a$10$mg4Y4EEp7l6DiBoOedhkAeMeYeqS/jxwuStaBl1sjiA9JUTr4QbPm',15),(14,'admin','admin','admin','admin@admin.sk','$2a$10$mg4Y4EEp7l6DiBoOedhkAeMeYeqS/jxwuStaBl1sjiA9JUTr4QbPm',NULL),(15,'approver1','approver1','approver1','approver1@approver1.sk','$2a$10$mg4Y4EEp7l6DiBoOedhkAeMeYeqS/jxwuStaBl1sjiA9JUTr4QbPm',16),(16,'approver2','approver2','approver2','approver2@approver2.sk','$2a$10$mg4Y4EEp7l6DiBoOedhkAeMeYeqS/jxwuStaBl1sjiA9JUTr4QbPm',17),(17,'approver3','approver3','approver3','approver3@approver3.sk','$2a$10$mg4Y4EEp7l6DiBoOedhkAeMeYeqS/jxwuStaBl1sjiA9JUTr4QbPm',NULL),(18,'procurement','procurement','procurement','procurement@procurement.sk','$2a$10$mg4Y4EEp7l6DiBoOedhkAeMeYeqS/jxwuStaBl1sjiA9JUTr4QbPm',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-03-11 21:16:54

CREATE DATABASE  IF NOT EXISTS `training_manager_ad` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;
USE `training_manager_ad`;
-- MySQL dump 10.13  Distrib 8.0.12, for Win64 (x86_64)
--
-- Host: localhost    Database: training_manager_ad
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clusters`
--

LOCK TABLES `clusters` WRITE;
/*!40000 ALTER TABLE `clusters` DISABLE KEYS */;
INSERT INTO `clusters` VALUES (1,'newcluster'),(2,'13'),(3,'789'),(4,'ffg'),(5,'8456'),(6,'ytu'),(7,'nnn'),(8,'cvbvbcbv'),(9,'pol'),(10,'pol'),(11,'opo'),(12,'liop'),(13,'Programovacie jazyky'),(14,'pipiopiouyuiuhk');
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `providers`
--

LOCK TABLES `providers` WRITE;
/*!40000 ALTER TABLE `providers` DISABLE KEYS */;
INSERT INTO `providers` VALUES (1,'google'),(2,'google'),(3,'google'),(4,'87'),(5,'15'),(6,'44'),(7,'poi'),(8,'Oracle');
/*!40000 ALTER TABLE `providers` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainings`
--

LOCK TABLES `trainings` WRITE;
/*!40000 ALTER TABLE `trainings` DISABLE KEYS */;
INSERT INTO `trainings` VALUES (1,'tr1'),(2,'45'),(3,'444'),(4,'tr1(copy)'),(5,'java training'),(6,'vbnbvnvbnbvn');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainings_has_clusters`
--

LOCK TABLES `trainings_has_clusters` WRITE;
/*!40000 ALTER TABLE `trainings_has_clusters` DISABLE KEYS */;
INSERT INTO `trainings_has_clusters` VALUES (2,3),(1,4),(4,4),(2,7),(3,7),(4,13),(5,13);
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
  `Price` int(11) NOT NULL,
  PRIMARY KEY (`idTraining`,`idProvider`,`Price`),
  KEY `fk_Trainings_has_Providers_Providers1_idx` (`idProvider`),
  KEY `fk_Trainings_has_Providers_Trainings1_idx` (`idTraining`),
  CONSTRAINT `fk_Trainings_has_Providers_Providers1` FOREIGN KEY (`idProvider`) REFERENCES `providers` (`idprovider`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Trainings_has_Providers_Trainings1` FOREIGN KEY (`idTraining`) REFERENCES `trainings` (`idtraining`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainings_has_providers`
--

LOCK TABLES `trainings_has_providers` WRITE;
/*!40000 ALTER TABLE `trainings_has_providers` DISABLE KEYS */;
INSERT INTO `trainings_has_providers` VALUES (2,3,145),(2,4,789),(3,4,789),(1,7,147),(4,7,1879),(4,8,1876),(5,8,1876);
/*!40000 ALTER TABLE `trainings_has_providers` ENABLE KEYS */;
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
  `trainingStatus` enum('Pending Approval','Accepted by TL','Accepted by LM','Accepted by Director','Accepted by Procurement','Denied by TL','Denied by LM','Denied by Director','Denied by Procurement') DEFAULT NULL,
  PRIMARY KEY (`idUser`,`idTraining`,`idProvider`,`idCluster`),
  KEY `fk_User_has_Training_Training1_idx` (`idTraining`),
  KEY `fk_User_has_Training_Providers1_idx` (`idProvider`),
  KEY `fk_User_has_Training_Clusters1_idx` (`idCluster`),
  CONSTRAINT `fk_User_has_Training_Clusters1` FOREIGN KEY (`idCluster`) REFERENCES `clusters` (`idcluster`),
  CONSTRAINT `fk_User_has_Training_Providers1` FOREIGN KEY (`idProvider`) REFERENCES `providers` (`idprovider`),
  CONSTRAINT `fk_User_has_Training_Training1` FOREIGN KEY (`idTraining`) REFERENCES `trainings` (`idtraining`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_has_training`
--

LOCK TABLES `user_has_training` WRITE;
/*!40000 ALTER TABLE `user_has_training` DISABLE KEYS */;
INSERT INTO `user_has_training` VALUES (70012629,1,1,1,'Pending Approval'),(70012629,2,3,7,'Pending Approval'),(70012629,3,4,7,'Pending Approval'),(70012629,4,7,13,'Pending Approval'),(70046244,1,1,1,'Pending Approval');
/*!40000 ALTER TABLE `user_has_training` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-15 21:53:16

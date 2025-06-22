-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: siec_dokumentacja
-- ------------------------------------------------------
-- Server version	8.0.41

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
-- Table structure for table `karty_wifi`
--

DROP TABLE IF EXISTS `karty_wifi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `karty_wifi` (
  `id_k` int NOT NULL AUTO_INCREMENT,
  `nazwa` varchar(100) NOT NULL,
  `status` enum('aktywny','nieaktywny') NOT NULL,
  `id_u` int NOT NULL,
  PRIMARY KEY (`id_k`),
  KEY `id_u` (`id_u`),
  CONSTRAINT `karty_wifi_ibfk_1` FOREIGN KEY (`id_u`) REFERENCES `urzadzenia` (`id_u`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lok_fiz`
--

DROP TABLE IF EXISTS `lok_fiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lok_fiz` (
  `id_u` int NOT NULL,
  `miejsce` varchar(100) NOT NULL,
  `szafa` varchar(50) NOT NULL,
  `rack` varchar(50) NOT NULL,
  PRIMARY KEY (`id_u`),
  CONSTRAINT `lok_fiz_ibfk_1` FOREIGN KEY (`id_u`) REFERENCES `urzadzenia` (`id_u`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mac_u`
--

DROP TABLE IF EXISTS `mac_u`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mac_u` (
  `id_u` int NOT NULL,
  `MAC` varchar(17) NOT NULL,
  PRIMARY KEY (`id_u`),
  UNIQUE KEY `MAC_UNIQUE` (`MAC`),
  CONSTRAINT `mac_u_ibfk_1` FOREIGN KEY (`id_u`) REFERENCES `urzadzenia` (`id_u`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pasmo`
--

DROP TABLE IF EXISTS `pasmo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pasmo` (
  `id_k` int NOT NULL,
  `pasmo24GHz` tinyint(1) NOT NULL,
  `pasmo5GHz` tinyint(1) NOT NULL,
  `pasmo6GHz` tinyint(1) NOT NULL,
  PRIMARY KEY (`id_k`),
  CONSTRAINT `pasmo_ibfk_1` FOREIGN KEY (`id_k`) REFERENCES `karty_wifi` (`id_k`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `polaczona_z`
--

DROP TABLE IF EXISTS `polaczona_z`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `polaczona_z` (
  `id_k_1` int NOT NULL,
  `id_k_2` int NOT NULL,
  `max_predkosc` varchar(20) NOT NULL,
  `pasmo` varchar(10) NOT NULL,
  PRIMARY KEY (`id_k_1`,`id_k_2`),
  KEY `id_k_2` (`id_k_2`),
  CONSTRAINT `polaczona_z_ibfk_1` FOREIGN KEY (`id_k_1`) REFERENCES `karty_wifi` (`id_k`) ON DELETE CASCADE,
  CONSTRAINT `polaczona_z_ibfk_2` FOREIGN KEY (`id_k_2`) REFERENCES `karty_wifi` (`id_k`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `polaczony_z`
--

DROP TABLE IF EXISTS `polaczony_z`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `polaczony_z` (
  `id_p_1` int NOT NULL,
  `id_p_2` int NOT NULL,
  `max_predkosc` varchar(20) NOT NULL,
  PRIMARY KEY (`id_p_1`,`id_p_2`),
  KEY `id_p_2` (`id_p_2`),
  CONSTRAINT `polaczony_z_ibfk_1` FOREIGN KEY (`id_p_1`) REFERENCES `porty` (`id_p`) ON DELETE CASCADE,
  CONSTRAINT `polaczony_z_ibfk_2` FOREIGN KEY (`id_p_2`) REFERENCES `porty` (`id_p`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `porty`
--

DROP TABLE IF EXISTS `porty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `porty` (
  `id_p` int NOT NULL AUTO_INCREMENT,
  `nazwa` varchar(50) NOT NULL,
  `status` enum('aktywny','nieaktywny') NOT NULL,
  `id_u` int NOT NULL,
  `typ` enum('RJ45','SFP') NOT NULL,
  PRIMARY KEY (`id_p`),
  KEY `id_u` (`id_u`),
  CONSTRAINT `porty_ibfk_1` FOREIGN KEY (`id_u`) REFERENCES `urzadzenia` (`id_u`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=135 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `predkosc_k`
--

DROP TABLE IF EXISTS `predkosc_k`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `predkosc_k` (
  `id_k` int NOT NULL,
  `predkosc` int NOT NULL,
  PRIMARY KEY (`id_k`),
  CONSTRAINT `predkosc_k_ibfk_1` FOREIGN KEY (`id_k`) REFERENCES `karty_wifi` (`id_k`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `predkosc_p`
--

DROP TABLE IF EXISTS `predkosc_p`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `predkosc_p` (
  `id_p` int NOT NULL,
  `predkosc` enum('10Mb/s','100Mb/s','1Gb/s','2,5Gb/s','5Gb/s','10Gb/s','25Gb/s') NOT NULL,
  PRIMARY KEY (`id_p`),
  CONSTRAINT `predkosc_p_ibfk_1` FOREIGN KEY (`id_p`) REFERENCES `porty` (`id_p`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `typy_urzadzen`
--

DROP TABLE IF EXISTS `typy_urzadzen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `typy_urzadzen` (
  `id_typu` int NOT NULL AUTO_INCREMENT,
  `typ_u` enum('Switch','PC','Router','Access Point') NOT NULL,
  `id_u` int NOT NULL,
  PRIMARY KEY (`id_typu`),
  KEY `id_u` (`id_u`),
  CONSTRAINT `typy_urzadzen_ibfk_1` FOREIGN KEY (`id_u`) REFERENCES `urzadzenia` (`id_u`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `urzadzenia`
--

DROP TABLE IF EXISTS `urzadzenia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `urzadzenia` (
  `id_u` int NOT NULL AUTO_INCREMENT,
  `nazwa_urzadzenia` varchar(100) NOT NULL,
  `ilosc_portow` int NOT NULL,
  PRIMARY KEY (`id_u`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wersja_wifi`
--

DROP TABLE IF EXISTS `wersja_wifi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wersja_wifi` (
  `id_k` int NOT NULL,
  `wersja` enum('B','G','N','AC','AX','BE') NOT NULL,
  PRIMARY KEY (`id_k`),
  CONSTRAINT `wersja_wifi_ibfk_1` FOREIGN KEY (`id_k`) REFERENCES `karty_wifi` (`id_k`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-22 12:54:44

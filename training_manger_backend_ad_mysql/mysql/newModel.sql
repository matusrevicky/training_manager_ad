-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema training_manager_ad
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema training_manager_ad
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `training_manager_ad` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `training_manager_ad` ;

-- -----------------------------------------------------
-- Table `training_manager_ad`.`Trainings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `training_manager_ad`.`Trainings` (
  `idTraining` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idTraining`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `training_manager_ad`.`Providers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `training_manager_ad`.`Providers` (
  `idProvider` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idProvider`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `training_manager_ad`.`Clusters`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `training_manager_ad`.`Clusters` (
  `idCluster` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idCluster`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `training_manager_ad`.`WholeTraining`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `training_manager_ad`.`WholeTraining` (
  `idWholeTraining` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `idProvider` BIGINT(20) NOT NULL,
  `idTraining` BIGINT(20) NOT NULL,
  `idCluster` BIGINT(20) NOT NULL,
  `Price` DECIMAL NOT NULL,
  `CreationTime` DATETIME NOT NULL,
  `Active` TINYINT NOT NULL DEFAULT 1,
  INDEX `fk_table1_Providers_idx` (`idProvider` ASC) VISIBLE,
  INDEX `fk_table1_Trainings1_idx` (`idTraining` ASC) VISIBLE,
  INDEX `fk_table1_Clusters1_idx` (`idCluster` ASC) VISIBLE,
  PRIMARY KEY (`idWholeTraining`),
  UNIQUE INDEX `unique_PTC` (`idProvider` ASC, `idTraining` ASC, `idCluster` ASC) VISIBLE,
  CONSTRAINT `fk_table1_Providers`
    FOREIGN KEY (`idProvider`)
    REFERENCES `training_manager_ad`.`Providers` (`idProvider`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_table1_Trainings1`
    FOREIGN KEY (`idTraining`)
    REFERENCES `training_manager_ad`.`Trainings` (`idTraining`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_table1_Clusters1`
    FOREIGN KEY (`idCluster`)
    REFERENCES `training_manager_ad`.`Clusters` (`idCluster`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `training_manager_ad`.`User_has_training`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `training_manager_ad`.`User_has_training` (
  `idUserHasTraining` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `idUser` BIGINT(20) NOT NULL,
  `idWholeTraining` BIGINT(20) NOT NULL,
  `TrainingStatus` INT NOT NULL,
  `SignUpDate` DATETIME NOT NULL,
  `DecisionByProcurementDate` DATETIME NULL,
  `AdditionalNoteProcurement` VARCHAR(5000) NOT NULL DEFAULT '\"\"',
  `AdditionalNoteUser` VARCHAR(5000) NOT NULL DEFAULT '\"\"',
  `ProcurementStatus` INT NOT NULL DEFAULT 0,
  `UserStatus` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`idUserHasTraining`),
  INDEX `fk_User_has_training_WholeTraining1_idx` (`idWholeTraining` ASC) VISIBLE,
  UNIQUE INDEX `unique_user_training` (`idUser` ASC, `idWholeTraining` ASC) VISIBLE,
  CONSTRAINT `fk_User_has_training_WholeTraining1`
    FOREIGN KEY (`idWholeTraining`)
    REFERENCES `training_manager_ad`.`WholeTraining` (`idWholeTraining`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

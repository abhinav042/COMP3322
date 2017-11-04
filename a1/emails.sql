-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: sophia
-- Generation Time: Oct 19, 2017 at 11:31 PM
-- Server version: 5.1.35
-- PHP Version: 5.5.9-1ubuntu4.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `agoyal`
--

-- --------------------------------------------------------

--
-- Table structure for table `emails`
--

CREATE TABLE IF NOT EXISTS `emails` (
  `emailID` int(11) NOT NULL,
  `sender` varchar(20) NOT NULL,
  `title` varchar(30) NOT NULL,
  `date` varchar(20) NOT NULL,
  `content` longtext NOT NULL,
  `mailbox` varchar(10) NOT NULL,
  PRIMARY KEY (`emailID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `emails`
--

INSERT INTO `emails` (`emailID`, `sender`, `title`, `date`, `content`, `mailbox`) VALUES
(1, 'Jim@cs.hku.hk', 'Hello from Toronto', 'Sep 25 2017', 'Hi Alice, I am traveling in Toronto now.', 'inbox'),
(2, 'Tim@cs.hku.hk', 'Hello from Someplace', 'Sep 26 2017', 'Hi Alice, I am traveling in Canada now.', 'inbox'),
(3, 'Jim@cs.hku.hk', 'Hello from Toronto', 'Sep 27 2017', 'Hi Alice, I am traveling in Toronto now.', 'inbox'),
(4, 'Jim@cs.hku.hk', 'Hello from Toronto', 'Sep 28 2017', 'Hi Alice, I am traveling in Toronto now.', 'inbox'),
(5, 'Jim@cs.hku.hk', 'Hello from Toronto', 'Sep 29 2017', 'Hi Alice, I am traveling in Toronto now.', 'inbox'),
(6, 'Jim@cs.hku.hk', 'Hello from Toronto', 'Sep 30 2017', 'Hi Alice, I am traveling in Toronto now.', 'inbox'),
(7, 'Jim@cs.hku.hk', 'Hello from Toronto', 'Oct 01 2017', 'Hi Alice, I am traveling in Toronto now.', 'inbox'),
(8, 'TAM@cs.hku.hk', 'Hello from Toronto', 'Oct 02 2017', 'Hi Alice, I am traveling in Toronto now.', 'inbox'),
(9, 'Jim@cs.hku.hk', 'Hello from Toronto', 'Oct 03 2017', 'Hi Alice, I am traveling in Toronto now.', 'inbox'),
(10, 'PEPP@cs.hku.hk', 'Hello from Vancouver', 'Oct 04 2017', 'Hi Alice, I am traveling in Vancouver now.', 'inbox'),
(11, 'Jim@cs.hku.hk', 'Hello from Time', 'Oct 05 2017', 'Hi Alice, I am time traveling now.', 'inbox'),
(12, 'Jim@cs.hku.hk', 'Hello from California', 'Oct 06 2017', 'Hi Alice, I am traveling in California now.', 'inbox'),
(13, 'AATAM@cs.hku.hk', 'Hello from Mexico', 'Oct 07 2017', 'Hi Alice, I am traveling in Mexico now.', 'inbox'),
(14, 'Jim@cs.hku.hk', 'Hello from Tunisia', 'Oct 15 2017', 'Hi Alice, I am traveling in Africa now.', 'inbox'),
(15, 'AATAM@cs.hku.hk', 'Hello from Malaysia', 'Oct 30 2017', 'Hi Alice, Happy Halloween I am traveling in Penang now.', 'inbox');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

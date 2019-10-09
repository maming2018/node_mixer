-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 09, 2019 at 03:03 PM
-- Server version: 10.3.16-MariaDB
-- PHP Version: 7.1.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `iludate`
--

-- --------------------------------------------------------

--
-- Table structure for table `mixer_channels`
--

CREATE TABLE `mixer_channels` (
  `id` int(11) NOT NULL,
  `channel_name` varchar(255) NOT NULL,
  `channel_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `mixer_channels`
--

INSERT INTO `mixer_channels` (`id`, `channel_name`, `channel_id`, `created_at`, `updated_at`) VALUES
(1, 'AustinNorman', 102582456, '2019-10-09 06:56:23', '2019-10-09 06:56:23'),
(2, 'Babalon_Don', 23383288, '2019-10-09 06:56:23', '2019-10-09 06:56:23'),
(3, 'Camara', 13905476, '2019-10-09 06:56:23', '2019-10-09 06:56:23'),
(4, 'FadedTrack27157', 102729102, '2019-10-09 06:56:23', '2019-10-09 06:56:23'),
(5, 'MoltenCupid7120', 102802767, '2019-10-09 06:56:23', '2019-10-09 06:56:23'),
(6, 'VintageRoom', 53877114, '2019-10-09 06:56:23', '2019-10-09 06:56:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `mixer_channels`
--
ALTER TABLE `mixer_channels`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `mixer_channels`
--
ALTER TABLE `mixer_channels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

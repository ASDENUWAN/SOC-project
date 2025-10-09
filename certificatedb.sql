-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 08, 2025 at 03:27 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `certificatedb`
--

-- --------------------------------------------------------

--
-- Table structure for table `quizresults`
--

CREATE TABLE `quizresults` (
  `id` int(11) NOT NULL,
  `course_id` varchar(50) NOT NULL,
  `student_id` varchar(50) NOT NULL,
  `exam_id` varchar(50) NOT NULL,
  `student_name` varchar(100) NOT NULL,
  `course_title` varchar(100) NOT NULL,
  `marks` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quizresults`
--

INSERT INTO `quizresults` (`id`, `course_id`, `student_id`, `exam_id`, `student_name`, `course_title`, `marks`) VALUES
(1, 'C101', 'S001', 'E001', 'Alice Johnson', 'Web Development', 85),
(2, 'C102', 'S002', 'E002', 'Bob Smith', 'Database Systems', 65),
(3, 'C103', 'S003', 'E003', 'Charlie Brown', 'Networking Basics', 50),
(4, 'C104', 'S004', 'E004', 'Diana Prince', 'Python Programming', 38),
(5, 'C105', 'S005', 'E005', 'Evan Peters', 'AI Foundations', 20);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `quizresults`
--
ALTER TABLE `quizresults`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `quizresults`
--
ALTER TABLE `quizresults`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

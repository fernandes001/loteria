CREATE SCHEMA `lottery` DEFAULT CHARACTER SET latin1 ;

--

CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(60) NOT NULL,
  `user_name` VARCHAR(30) NULL,
  `password` VARCHAR(64) NOT NULL COMMENT 'Sha256 default 64 characters',
  `account_checked` INT(1) NOT NULL,
  `twofa_code` VARCHAR(10) NULL,
  `twofa_status` INT(1) NOT NULL,
  `token` VARCHAR(32) NULL COMMENT 'MD5 token',
  `level` INT(1) NOT NULL,
  `blocked` INT(1) NOT NULL,
  `dt_token_expiration` BIGINT(13) NULL,
  `deleted` INT(1) NOT NULL DEFAULT 0,
  `dt_created` BIGINT(13) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC));

--

CREATE TABLE `logs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `type` INT(2) NOT NULL COMMENT '1 = Change password;\n2 = Buy ticket;\n…',
  `date` BIGINT(13) NOT NULL,
  `extra` VARCHAR(250) NULL COMMENT 'JSON extra field',
  PRIMARY KEY (`id`),
  INDEX `logs_fk_users_idx` (`user_id` ASC),
  CONSTRAINT `logs_fk_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

--

CREATE TABLE `lotteries` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(50) NOT NULL,
  `description` VARCHAR(250) NULL,
  `numbers_count` VARCHAR(7) NOT NULL COMMENT 'Start - End\n- Examples\n0-100\n50-100',
  `choice_numbers` INT(3) NOT NULL,
  `lottery_day` BIGINT(13) NOT NULL,
  `percent_lottery` DECIMAL(5,2) NOT NULL,
  `percent_house` DECIMAL(5,2) NOT NULL,
  `ticket_price` BIGINT(11) NOT NULL,
  `default_prize` BIGINT(11) NOT NULL,
  `result` VARCHAR(250) NULL COMMENT 'JSON numbers',
  `blocked` INT(1) NOT NULL,
  `deleted` INT(1) NOT NULL DEFAULT 0,
  `dt_created` BIGINT(13) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `lotteries_fk_users_idx` (`user_id` ASC),
  CONSTRAINT `lotteries_fk_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- 

CREATE TABLE `deposits` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `amount` BIGINT(11) NULL,
  `address` VARCHAR(44) NULL,
  `txid` VARCHAR(72) NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'unconfirmed',
  `type` VARCHAR(20) NOT NULL DEFAULT 'deposit',
  `dt_created` BIGINT(13) NULL,
  PRIMARY KEY (`id`),
  INDEX `deposits_fk_users_idx` (`user_id` ASC),
  CONSTRAINT `deposits_fk_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- 

CREATE TABLE `tickets` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `lottery_id` INT UNSIGNED NOT NULL,
  `numbers_bet` VARCHAR(250) NOT NULL COMMENT 'JSON data',
  `qt_tickets` INT(6) UNSIGNED NOT NULL,
  `ticket_price` BIGINT(11) NULL,
  `prize_paid` BIGINT(11) NULL,
  `canceled` INT(1) NOT NULL DEFAULT 0,
  `win` INT(1) NOT NULL DEFAULT 0,
  `dt_created` BIGINT(13) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `tickets_fk_users_idx` (`user_id` ASC),
  INDEX `tickets_fk_lotteries_idx` (`lottery_id` ASC),
  CONSTRAINT `tickets_fk_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `tickets_fk_lotteries`
    FOREIGN KEY (`lottery_id`)
    REFERENCES `lotteries` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

--

CREATE TABLE `lottery`.`withdrawal` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT(10) UNSIGNED NOT NULL,
  `fee` BIGINT(11) UNSIGNED NOT NULL,
  `amount` BIGINT(11) UNSIGNED NOT NULL,
  `memo` VARCHAR(50) NULL,
  `txid` VARCHAR(72) NULL,
  `raw` VARCHAR(1000) NULL,
  `to_address` VARCHAR(44) NOT NULL,
  `type` VARCHAR(20) NOT NULL,
  `status` VARCHAR(20) NOT NULL,
  `dt_created` BIGINT(13) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `withdrawal_fk_users_idx` (`user_id` ASC),
  CONSTRAINT `withdrawal_fk_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `lottery`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
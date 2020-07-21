create schema notes_app;

use notes_app;

create table users(userId int not null,userName varchar(20) not null,password varchar(100) not null,primary key (userName));

create table notes(userId int not null,notes text);
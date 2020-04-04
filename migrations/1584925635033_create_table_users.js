module.exports = {
  up: `create table user(
    id int(11) auto_increment primary key,
    nickname varchar(24) not null,
    avatar longtext null,
    email varchar(128) not null,
    password varchar(256)  not null,
    is_enabled boolean not null,
    created_date datetime not null,
    updated_date datetime null,
    deleted_date datetime null
  )`,
};

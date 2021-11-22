use myblog;
-- show tables; 

insert into users(username, `password`, realname) values ('lisi', '123', '李四');
insert into users(username, `password`, realname) values ('zhangsan', '456', '张三');
insert into users(username, `password`, realname) values ('zhangergou', '456', '张二狗');

select * from users where state=1;
select * from users where state<>0;

select id, username from users 
	where username like '%zhang%'
    order by id desc;
    
update users set `password`='789' where username='zhangergou';

update users set `password`='524ab85686df0e52ada43b11b53cce35' where username='lisi';
update users set `password`='77514e17a05943705bbf0299b29db7d4' where username='zhangsan';

-- 软删除, 一般不会用delete直接删, 而是通过设置state
update users set state=0 where username='zhangergou';

-- -------------------------------------------
select * from blogs;

insert into blogs(title, content, createtime, author) values ('标题C', '内容C', 1635928732012, 'lisi');

select * from blogs
	where author='lisi'
	order by createtime desc;

select * from blogs 
	where title like '%标题%'
    order by createtime desc; 
    
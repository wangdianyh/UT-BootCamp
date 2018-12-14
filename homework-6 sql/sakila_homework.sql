use sakila;

#1a. Display the first and last names of all actors from the table actor.
select actor.first_name, actor.last_name from actor;

#1b. Display the first and last name of each actor in a single column in upper case letters. Name the column Actor Name.
select upper(concat(actor.first_name, ', ', actor.last_name)) as 'Actor Name' from actor;

#2a. You need to find the ID number, first name, and last name of an actor, of whom you know only the first name, "Joe." What is one query would you use to obtain this information?
select actor.actor_id, actor.first_name, actor.last_name from actor where actor.first_name = 'Joe';

#2b. Find all actors whose last name contain the letters GEN:
select * from actor where actor.last_name like '%GEN%';

#2c. Find all actors whose last names contain the letters LI. This time, order the rows by last name and first name, in that order:
select * from actor where actor.last_name like '%LI%' order by actor.last_name, actor.first_name;

#2d. Using IN, display the country_id and country columns of the following countries: Afghanistan, Bangladesh, and China:
select country.country_id, country.country from country where country.country in ('Afghanistan', 'Bangladesh', 'China');

#3a. You want to keep a description of each actor. You don't think you will be performing queries on a description, so create a column in the table actor named description and use the data type BLOB (Make sure to research the type BLOB, as the difference between it and VARCHAR are significant).
ALTER TABLE actor ADD description BLOB;

#3b. Very quickly you realize that entering descriptions for each actor is too much effort. Delete the description column.
ALTER TABLE actor
DROP COLUMN description; 

#4a. List the last names of actors, as well as how many actors have that last name.
select actor.last_name, count(actor.last_name) as last_name_num from actor group by actor.last_name;

#4b. List last names of actors and the number of actors who have that last name, but only for names that are shared by at least two actors
select actor.last_name, count(actor.last_name) as last_name_num 
from actor 
group by actor.last_name
having count(actor.last_name) > 1;

#4c. The actor HARPO WILLIAMS was accidentally entered in the actor table as GROUCHO WILLIAMS. Write a query to fix the record.
update actor
set actor.first_name = 'HARPO'
where actor.first_name = 'GROUCHO' and actor.last_name = 'WILLIAMS';

#4d. Perhaps we were too hasty in changing GROUCHO to HARPO. It turns out that GROUCHO was the correct name after all! In a single query, if the first name of the actor is currently HARPO, change it to GROUCHO.
update actor
set actor.first_name = 'GROUCHO'
where actor.first_name = 'HARPO' and actor.last_name = 'WILLIAMS';

#5a. You cannot locate the schema of the address table. Which query would you use to re-create it?
#Hint: https://dev.mysql.com/doc/refman/5.7/en/show-create-table.html
show create table address;

#6a. Use JOIN to display the first and last names, as well as the address, of each staff member. Use the tables staff and address:
select staff.first_name, staff.last_name, address.address
from staff
left join address
on staff.address_id = address.address_id;

#6b. Use JOIN to display the total amount rung up by each staff member in August of 2005. Use tables staff and payment.
select staff.first_name, staff.last_name, sum(payment.amount) as total_amount
from staff 
left join payment
on staff.staff_id = payment.staff_id
where payment.payment_date like '2005-08%' 
group by staff.staff_id;

#6c. List each film and the number of actors who are listed for that film. Use tables film_actor and film. Use inner join.
select film.film_id, film.title, count(film_actor.actor_id) as actor_number
from film
inner join film_actor
on film.film_id = film_actor.film_id
group by film_actor.film_id;

#6d. How many copies of the film Hunchback Impossible exist in the inventory system?
select film.title, count(inventory.inventory_id) as number_of_copies
from film
left join inventory
on film.film_id = inventory.film_id
where film.title like '%Hunchback Impossible%'
group by film.film_id;

#6e. Using the tables payment and customer and the JOIN command, list the total paid by each customer. List the customers alphabetically by last name:
select customer.first_name, customer.last_name, sum(payment.amount) as total_payment
from customer
left join payment
on customer.customer_id = payment.customer_id
group by customer.customer_id
order by customer.last_name;

#7a. The music of Queen and Kris Kristofferson have seen an unlikely resurgence. As an unintended consequence, films starting with the letters K and Q have also soared in popularity. Use subqueries to display the titles of movies starting with the letters K and Q whose language is English.
select film.title
from film
where film.language_id in(
	select language_id
    from language
    where language.name = 'English'
)
having film.title like 'K%' or film.title like 'Q%';

#7b. Use subqueries to display all actors who appear in the film Alone Trip.
select *
from actor
where actor.actor_id in(
	select film_actor.actor_id
    from film_actor
    where film_actor.film_id in(
		select film.film_id
        from film
        where film.title = 'Alone Trip'
    )
);

#7c. You want to run an email marketing campaign in Canada, for which you will need the names and email addresses of all Canadian customers. Use joins to retrieve this information.
select customer.customer_id, customer.first_name, customer.last_name, customer.email
from customer
where customer.address_id in(
	select address.address_id
    from address
    where address.city_id in(
		select city.city_id
        from city
        where city.country_id in(
			select country.country_id
            from country
            where country.country = 'Canada'
        )
    )
);

#7d. Sales have been lagging among young families, and you wish to target all family movies for a promotion. Identify all movies categorized as family films.
select film.film_id, film.title
from film
where film.film_id in(
	select film_category.film_id
    from film_category
    where film_category.category_id in(
		select category.category_id
        from category
        where category.name = 'Family'
	)
);

#7e. Display the most frequently rented movies in descending order.
select film.film_id, film.title, count(rental.rental_id)
from film
left join inventory
on film.film_id = inventory.film_id
left join rental
on inventory.inventory_id = rental.inventory_id
group by film.film_id
order by count(rental.rental_id) desc;

#7f. Write a query to display how much business, in dollars, each store brought in.
select customer.store_id, sum(payment.amount) as business_in_$
from customer
left join payment
on customer.customer_id = payment.customer_id
group by customer.store_id;

#7g. Write a query to display for each store its store ID, city, and country.
select store.store_id, city.city, country.country
from store
left join address
on address.address_id = store.address_id
left join city
on city.city_id = address.city_id
left join country
on country.country_id = city.country_id;

#7h. List the top five genres in gross revenue in descending order. (Hint: you may need to use the following tables: category, film_category, inventory, payment, and rental.)
select category.name, sum(payment.amount) as gross_revenue
from category
left join film_category
on film_category.category_id = category.category_id
left join inventory
on inventory.film_id = film_category.film_id
left join rental
on rental.inventory_id = inventory.inventory_id
left join payment
on payment.rental_id = rental.rental_id
group by category.category_id
order by sum(payment.amount) desc
limit 5;

#8a. In your new role as an executive, you would like to have an easy way of viewing the Top five genres by gross revenue. Use the solution from the problem above to create a view. If you haven't solved 7h, you can substitute another query to create a view.
create view top_five_genres as
select category.name, sum(payment.amount) as gross_revenue
from category
left join film_category
on film_category.category_id = category.category_id
left join inventory
on inventory.film_id = film_category.film_id
left join rental
on rental.inventory_id = inventory.inventory_id
left join payment
on payment.rental_id = rental.rental_id
group by category.category_id
order by sum(payment.amount) desc
limit 5;

#8b. How would you display the view that you created in 8a?
select * from top_five_genres;

#8c. You find that you no longer need the view top_five_genres. Write a query to delete it.
drop view top_five_genres;
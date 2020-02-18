-- Database = test.db  
-- <variable name="<food_name>" value="whisky" />


.headers on
.separator |

select 
food,
count(food) as countOf 
from t_foods
where food = '<food_name>'
;


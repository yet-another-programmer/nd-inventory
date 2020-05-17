/* A function that randomly generates numbers from 1-800 and inputs them in a databse */
var mysql = require('mysql');
var con = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'patients',
	port : '3308'
});

let num, already = new Object;

let start = 1, end = 801;
let j =1000;
var cr = [];

for (let i = 1; i <= 800;)
{
    num = (Math.random() * (end - start) + start) ^ 0;
    if (!(num in already))
    {
        already[num] = num;
        i++;
        
        if (i <= 800)
            // console.log(num);
            if (num>0 && num<=200)
            {
                var course = "Placebo";
            }
            else if (num>200 && num<=400)
            {
                var course = "HQ_L";
            }
            else if (num>400 && num<=600)
            {
                var course = "HQ_H";
            }
            else if (num >600 && num<=800)
            {
                var course = "HQ+AZ";
            }
            con.query("INSERT INTO details(id,number,course) values (?,?,?)",[num,j,course],function (err,results,fields){
                if (err)
                throw (err);
            })
            j=j+1;
            // cr.push(course);
            // console.log(j,num,course);

            


            
    }
    
    
}
console.log(cr.length);

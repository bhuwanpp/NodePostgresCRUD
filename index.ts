import express, { Response, Request } from "express"
import bodyParser from 'body-parser';
import pg, { Query } from 'pg'
import { QueryResult } from 'pg';

const app = express();
const { Pool } = pg
const port: number = 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: '12345678'
})
async function Hello() {
    const result = await pool.query('SELECT * from school;')
    console.log(result.rows)
}
Hello()

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})
app.route('/users/')
    .get(async (req: Request, res: Response): Promise<Response> => {
        const query: QueryResult = await pool.query('SELECT * FROM school')
        return res.json(query.rows)
    })

    .post(async (req: Request, res: Response): Promise<Response> => {
        const { name, rollno, email } = req.body;
        const query: QueryResult = await pool.query('INSERT INTO school (name,rollno,email) VALUES($1,$2,$3) RETURNING *', [name, rollno, email])
        return res.json(query.rows)
    })
app.route('/users/:id')
    .put(async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id
        const { name, rollno, email } = req.body;
        const query: QueryResult = await pool.query('UPDATE school SET name = $1,email =$2 WHERE rollno = $3 RETURNING * ', [name, email, id])
        return res.json(query.rows)
    })
    .delete(async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id
        const query: QueryResult = await pool.query('DELETE FROM school where rollno = $1', [id])
        return res.json(` Roll no ${id} is deleted succesfully`)
    })


app.listen(port, () => {
    console.log(`Example app listening on localhost port  ${port}`)

})
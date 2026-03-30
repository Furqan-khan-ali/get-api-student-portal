const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// SQL Server config
const dbConfig = {
    user: 'sa',                // your SQL username
    password: 'Admin@SQL',           // your SQL password
    server: 'SERVERPC',    // or YOUR_PC_NAME\SQLEXPRESS
    database: 'sesDB',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// GET API (Fetch data)
// app.get("/users", async (req, res) => {
//     try {
//         let pool = await sql.connect(dbConfig);
//         let result = await pool.request().query("SELECT * FROM STUD_MASTER");
//         res.json(result.recordset);

//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });

app.get("/search", async (req, res) => {
    const { name, seatno, dept } = req.query;

    try {
        let pool = await sql.connect(dbConfig);

        let query = `
            SELECT 
                STUD_DETAIL.SEATNO, STUD_DETAIL.SEMNO, STUD_MASTER.NAME, STUD_MASTER.SEX, STUD_MASTER.FNAME, 
                STUD_MASTER.DEPT_NAME, STUD_MASTER.ENRNO, STUD_MASTER.CLASS_NAME, STUD_MASTER.FACULTY, 
                STUD_DETAIL.COURSENO, STUD_DETAIL.CH, STUD_DETAIL.CREDITHOUR1, STUD_DETAIL.CREDITHOUR2,
                STUD_DETAIL.TERMINAL, STUD_DETAIL.EXT_TERMINAL, STUD_DETAIL.TOTALMARKS, STUD_DETAIL.GRATIO, 
                STUD_DETAIL.GPOINT, STUD_DETAIL.COURSETITEL, STUD_DETAIL.USERNAME, STUD_DETAIL.CLASSYEAR, 
                F_REMARKS.FINALREMARKS, F_REMARKS.TOTALMARKS AS Expr1, PASSFAIL.RESULT, PASSFAIL.PROMOTE, 
                SEM_STATUS.CLEARCOURSES, SEM_STATUS.FIXEDCOURSES
            FROM STUD_DETAIL 
            INNER JOIN STUD_MASTER ON STUD_DETAIL.SEATNO = STUD_MASTER.SEATNO 
            INNER JOIN SEM_STATUS ON STUD_DETAIL.SEATNO = SEM_STATUS.SEATNO AND STUD_DETAIL.SEMNO = SEM_STATUS.SEMNO 
            INNER JOIN PASSFAIL ON STUD_DETAIL.SEATNO = PASSFAIL.SEATNO AND STUD_DETAIL.SEMNO = PASSFAIL.SEMNO 
            INNER JOIN F_REMARKS ON STUD_DETAIL.SEATNO = F_REMARKS.SEATNO AND STUD_DETAIL.SEMNO = F_REMARKS.SEMNO         
            WHERE 1=1
            `;

        if (name) query += ` AND STUD_MASTER.NAME LIKE '%${name}%'`;
        if (seatno) query += ` AND STUD_DETAIL.SEATNO LIKE '%${seatno}%'`;
        if (dept) query += ` AND STUD_MASTER.DEPT_NAME LIKE '%${dept}%'`;

        query += ` ORDER BY STUD_DETAIL.SEMNO, STUD_DETAIL.COURSENO`;

        let result = await pool.request().query(query);

        res.json(result.recordset);

    } catch (err) {
        res.status(500).send(err.message);
    }
});


// POST API (Insert data)
app.post("/adduser", async (req, res) => {
    const { NAME, SEATNO } = req.body;

    try {
        let pool = await sql.connect(dbConfig);
        await pool.request()
            .input('NAME', sql.VarChar, name)
            .input('SEATNO', sql.VarChar, SEATNO)
            .query("INSERT INTO STUD_MASTER (NAME, SEATNO) VALUES (@NAME, @SEATNO)");

        res.json({ message: "User added successfully" });

    } catch (err) {
        res.status(500).send(err.message);
    }
});

//app.listen(5000, () => console.log("API running on http://localhost:5000"));
 app.listen(5000, "0.0.0.0", () => {
   console.log("API new5 running on port 5000");
 });


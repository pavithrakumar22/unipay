"use strict";


import express_1 from 'express';
import cors_1 from 'cors';
import dotenv from 'dotenv';

dotenv.config();
var PORT = process.env.PORT || 5001;
// Middleware
const app = express_1();
app.use(express_1.json());
app.use(cors_1());
// Temporary storage for students
var students = [];
// GET all students
app.get("/students", function (req, res) {
    res.json({ students: students });
});
// POST a new student
app.post("/students", function (req, res) {
    var _a = req.body, name = _a.name, age = _a.age, course = _a.course;
    if (!name || !age || !course) {
        return res.status(400).json({ error: "All fields are required!" });
    }
    var newStudent = { name: name, age: age, course: course };
    students.push(newStudent);
    res.status(201).json({ message: "Student added successfully!", student: newStudent });
});
// Start Server
app.listen(PORT, function () {
    console.log("Server running on port ".concat(PORT));
});

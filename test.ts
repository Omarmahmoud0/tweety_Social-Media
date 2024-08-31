
// تقبل اي قيمة من اي نوع
const obj: {[key:string]: any} ={
    name: 'omar'
}
// Types and Interface
interface Person {
    name: string;
    age: number;
}

type Name = {
    name: string;
    age: number
}
//======

const sum: Name = {
    name: 'omar',
    age: 25
}

// Genrics <T>
const sums = <T>(name: T,age: T) => {
    
}

sums<number>(1,2)

function Load <T>(name:T) {
 console.log(name);
}

Load<string>("omar")
// Genrics <T>


// Utilitys

// 1- Omit accepted all interface without proprtiy you selected

interface PersonWithName extends Omit<Person,"age">{}

const p:PersonWithName = {
    name: "Omar"
}

// 2- Pick not accepted all interface without proprtiy you selected

interface PersonWithAge extends Pick<Person,"age">{}

const A: PersonWithAge = {
    age: 25
}


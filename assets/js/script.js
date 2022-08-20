google.charts.load('current', {
    'packages': ['corechart', 'bar']
});
google.charts.setOnLoadCallback(loadTable);

function loadTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/salaries");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var trHTML = '';
            var num = 1;
            const objects = JSON.parse(this.responseText);
            for (let object of objects) {

                trHTML += '<tr>';
                trHTML += '<td>' + num + '</td>';
                trHTML += '<td>' + object['work_year'] + '</td>';
                trHTML += '<td>' + object['experience_level'] + '</td>';
                trHTML += '<td>' + object['employment_type'] + '</td>';
                trHTML += '<td>' + object['job_title'] + '</td>';
                trHTML += '<td>' + object['salary'] + '</td>';
                trHTML += '<td>' + object['salary_currency'] + '</td>';
                trHTML += '<td>' + object['salary_in_usd'] + '</td>';
                trHTML += '<td>' + object['employee_residence'] + '</td>';
                trHTML += '<td>' + object['remote_ratio'] + '</td>';
                trHTML += '<td>' + object['company_location'] + '</td>';
                trHTML += '<td>' + object['company_size'] + '</td>';
                trHTML += '<td>';
                trHTML += '<a type="button" class="btn btn-outline-secondary" onclick="showCompliantEditBox(\'' + object['_id'] + '\')"><i class="fas fa-edit"></i></a>';
                trHTML += '<a type="button" class="btn btn-outline-danger" onclick="compliantDelete(\'' + object['_id'] + '\')"><i class="fas fa-trash"></i></a></td>';
                trHTML += "</tr>";

                num++;
            }
            document.getElementById("mytable").innerHTML = trHTML;

            loadGraph();
        }
    };
}

function loadQueryTable() {
    document.getElementById("mytable").innerHTML = "<tr><th scope=\"row\" colspan=\"5\">Loading...</th></tr>";
    const searchText = document.getElementById('searchTextBox').value;

    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/salaries/job_title/" + searchText);

    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var trHTML = '';
            var num = 1;
            const objects = JSON.parse(this.responseText).salaries;
            for (let object of objects) {
                trHTML += '<tr>';
                trHTML += '<td>' + num + '</td>';
                trHTML += '<td>' + object['work_year'] + '</td>';
                trHTML += '<td>' + object['experience_level'] + '</td>';
                trHTML += '<td>' + object['employment_type'] + '</td>';
                trHTML += '<td>' + object['job_title'] + '</td>';
                trHTML += '<td>' + object['salary'] + '</td>';
                trHTML += '<td>' + object['salary_currency'] + '</td>';
                trHTML += '<td>' + object['salary_in_usd'] + '</td>';
                trHTML += '<td>' + object['employee_residence'] + '</td>';
                trHTML += '<td>' + object['remote_ratio'] + '</td>';
                trHTML += '<td>' + object['company_location'] + '</td>';
                trHTML += '<td>' + object['company_size'] + '</td>';
                trHTML += '<td>';
                trHTML += '<a type="button" class="btn btn-outline-secondary" onclick="showCompliantEditBox(\'' + object['_id'] + '\')"><i class="fas fa-edit"></i></a>';
                trHTML += '<a type="button" class="btn btn-outline-danger" onclick="compliantDelete(\'' + object['_id'] + '\')"><i class="fas fa-trash"></i></a></td>';
                trHTML += "</tr>";
                num++;


            }
            console.log(trHTML);
            document.getElementById("mytable").innerHTML = trHTML;

        }
    };
}

function loadGraph() {
    var Contract = 0;
    var Freelance = 0;
    var Full_time = 0;
    var Part_time = 0;
    var other = 0;

    var Web = 0;
    var Phone = 0;
    var Fax = 0;
    var Postal = 0;
    var Referral = 0;
    var subother = 0;

    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/salaries");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            for (let object of objects) {
                switch (object['employment_type']) {
                    case "Contract":
                        Contract = Contract + 1;
                        break;
                    case "Freelance":
                        Freelance = Freelance + 1;
                        break;
                    case "Full-time":
                        Full_time = Full_time + 1;
                        break;
                    case "Part-time":
                        Part_time = Part_time + 1;
                        break;
                    default:
                        other = other + 1;
                        break;
                }

                switch (object['Submitted via']) {
                    case "Web":
                        Web = Web + 1;
                        break;
                    case "Phone":
                        Phone = Phone + 1;
                        break;
                    case "Postal mail":
                        Postal = Postal + 1;
                        break;
                    case "Referral":
                        Referral = Referral + 1;
                        break;
                    case "Fax":
                        Fax = Fax + 1;
                        break;
                    default:
                        subother = subother + 1;
                        break;
                }
            }

            var TimelyResponseData = google.visualization.arrayToDataTable([
                ['', ''],
                ['Contract', Contract],
                ['Freelance', Freelance],
                ['Full-time', Full_time],
                ['Part-time', Part_time],
                ['Other', other]
            ]);

            var optionsTimelyResponse = {
                title: 'Timely Response Stats (Latest  10000 cases)',
                is3D: true
            };
            var chartTimelyResponse = new google.visualization.PieChart(document.getElementById('piechartTimelyResponse'));
            chartTimelyResponse.draw(TimelyResponseData, optionsTimelyResponse);

            var dataSubmitted = google.visualization.arrayToDataTable([
                ['Submitted Via', 'Number', {
                    role: 'style'
                }, {
                        role: 'annotation'
                    }],
                ['Web', Web, 'gold', 'Web'],
                ['Phone', Phone, 'color: #F65A83', 'Phone'],
                ['Postal mail', Postal, 'color: #F9F5EB', 'Postal mail'],
                ['Referral', Referral, 'color: #607EAA', 'Referral'],
                ['Fax', Fax, 'color: #E04D01', 'Fax'],
                ['Other', subother, 'color: #1C3879', 'Other']
            ]);

            var optionSubmitted = {
                title: 'Submitted Via Stats (Latest  10000 cases)',
                legend: { position: 'none' }
            };

            var chartSubmitted = new google.visualization.BarChart(document.getElementById('barchartSubmitted'));
            chartSubmitted.draw(dataSubmitted, optionSubmitted);
        }
    };


}

function showCompliantCreateBox() {

    Swal.fire({
        title: 'Create Data',
        html:
            '<div class="mb-3"><label for="work_year" class="form-label">Work Year</label>' +
            '<input class="form-control" id="work_year" placeholder="Work Year"></div>' +
            '<div class="mb-3"><label for="experience_level" class="form-label">Experience Level</label>' +
            '<input class="form-control" id="experience_level" placeholder="Experience Level"></div>' +
            '<div class="mb-3"><label for="employment_type" class="form-label">Employment Type</label>' +
            '<input class="form-control" id="employment_type" placeholder="Employment Type"></div>' +
            '<div class="mb-3"><label for="job_title" class="form-label">Job Title</label>' +
            '<input class="form-control" id="job_title" placeholder="Job Title"></div>' +
            '<div class="mb-3"><label for="salary" class="form-label">Salary</label>' +
            '<input class="form-control" id="salary" placeholder="Salary"></div>' +
            '<div class="mb-3"><label for="salary_currency" class="form-label">Salary Currency</label>' +
            '<input class="form-control" id="salary_currency" placeholder="Salary Currency"></div>' +
            '<div class="mb-3"><label for="salary_in_usd" class="form-label">Salary in Usd</label>' +
            '<input class="form-control" id="salary_in_usd" placeholder="Salary in Usd"></div>' +
            '<div class="mb-3"><label for="employee_residence" class="form-label">Employee Residence</label>' +
            '<input class="form-control" id="employee_residence" placeholder="Employee Residence"></div>' +
            '<div class="mb-3"><label for="remote_ratio" class="form-label">Remote Ratio</label>' +
            '<input class="form-control" id="remote_ratio" placeholder="Remote Ratio"></div>' +
            '<div class="mb-3"><label for="company_location" class="form-label">Company Location</label>' +
            '<input class="form-control" id="company_location" placeholder="Company Location"></div>' +
            '<div class="mb-3"><label for="company_size" class="form-label">Company Size</label>' +
            '<input class="form-control" id="company_size" placeholder="Company Size"></div>',
        focusConfirm: false,
        preConfirm: () => {
            compliantCreate();
        }
    });
}

function compliantCreate() {

    const work_year = document.getElementById("work_year").value;
    const experience_level = document.getElementById("experience_level").value;
    const employment_type = document.getElementById("employment_type").value;
    const job_title = document.getElementById("job_title").value;
    const salary = document.getElementById("salary").value;
    const salary_currency = document.getElementById("salary_currency").value;
    const salary_in_usd = document.getElementById("salary_in_usd").value;
    const employee_residence = document.getElementById("employee_residence").value;
    const remote_ratio = document.getElementById("remote_ratio").value;
    const company_location = document.getElementById("company_location").value;
    const company_size = document.getElementById("company_size").value;

    console.log(JSON.stringify({
        'work_year': work_year,
        'experience_level': experience_level,
        'employment_type': employment_type,
        'job_title': job_title,
        'salary': salary,
        'salary_currency': salary_currency,
        'salary_in_usd': salary_in_usd,
        'employee_residence': employee_residence,
        'remote_ratio': remote_ratio,
        'company_location': company_location,
        'company_size': company_size
    }));

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3000/salaries/create");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        'work_year': work_year,
        'experience_level': experience_level,
        'employment_type': employment_type,
        'job_title': job_title,
        'salary': salary,
        'salary_currency': salary_currency,
        'salary_in_usd': salary_in_usd,
        'employee_residence': employee_residence,
        'remote_ratio': remote_ratio,
        'company_location': company_location,
        'company_size': company_size
    }));
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            Swal.fire(
                'Good job!',
                'Create salaries Successfully!',
                'success'
            );
            loadTable();
        }
    };
}

function compliantDelete(id) {
    console.log("Delete: ", id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "http://localhost:3000/salaries/delete");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        "_id": id
    }));
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            const objects = JSON.parse(this.responseText);
            Swal.fire(
                'Good job!',
                'Delete salaries Successfully!',
                'success'
            );
            loadTable();
        }
    };
}

function showCompliantEditBox(id) {
    console.log("edit", id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/salaries/" + id);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const object = JSON.parse(this.responseText);
            console.log("showCompliantEditBox", object);
            Swal.fire({
                title: 'Edit salaries',
                html: '<input id="id" class="swal2-input" placeholder="id" type="hidden" value="' + object['_id'] + '"><br>' +
                    '<div class="mb-3"><label for="work_year" class="form-label">Work Year</label>' +
                    '<input class="form-control" id="work_year" placeholder="Work Year" value="' + object['work_year'] + '"></div>' +
                    '<div class="mb-3"><label for="experience_level" class="form-label">Experience Level</label>' +
                    '<input class="form-control" id="experience_level" placeholder="Experience Level" value="' + object['experience_level'] + '"></div>' +
                    '<div class="mb-3"><label for="employment_type" class="form-label">Employment Type</label>' +
                    '<input class="form-control" id="employment_type" placeholder="Employment Type" value="' + object['employment_type'] + '"></div>' +
                    '<div class="mb-3"><label for="job_title" class="form-label">Job Title</label>' +
                    '<input class="form-control" id="job_title" placeholder="Job Title" value="' + object['job_title'] + '"></div>' +
                    '<div class="mb-3"><label for="salary" class="form-label">Salary</label>' +
                    '<input class="form-control" id="salary" placeholder="Salary" value="' + object['salary'] + '"></div>' +
                    '<div class="mb-3"><label for="salary_currency" class="form-label">Salary Currency</label>' +
                    '<input class="form-control" id="salary_currency" placeholder="Salary Currency" value="' + object['salary_currency'] + '"></div>' +
                    '<div class="mb-3"><label for="salary_in_usd" class="form-label">Salary in Usd</label>' +
                    '<input class="form-control" id="salary_in_usd" placeholder="Salary in Usd" value="' + object['salary_in_usd'] + '"></div>' +
                    '<div class="mb-3"><label for="employee_residence" class="form-label">Employee Residence</label>' +
                    '<input class="form-control" id="employee_residence" placeholder="Employee Residence" value="' + object['employee_residence'] + '"></div>' +
                    '<div class="mb-3"><label for="remote_ratio" class="form-label">Remote Ratio</label>' +
                    '<input class="form-control" id="remote_ratio" placeholder="Remote Ratio" value="' + object['remote_ratio'] + '"></div>' +
                    '<div class="mb-3"><label for="company_location" class="form-label">Company Location</label>' +
                    '<input class="form-control" id="company_location" placeholder="Company Location" value="' + object['company_location'] + '"></div>' +
                    '<div class="mb-3"><label for="company_size" class="form-label">Company Size</label>' +
                    '<input class="form-control" id="company_size" placeholder="Company Size" value="' + object['company_size'] + '"></div>',
                focusConfirm: false,
                preConfirm: () => {
                    userEdit();
                }
            });
        }
    };
}

function userEdit() {
    const id = document.getElementById("id").value;
    const work_year = document.getElementById("work_year").value;
    const experience_level = document.getElementById("experience_level").value;
    const employment_type = document.getElementById("employment_type").value;
    const job_title = document.getElementById("job_title").value;
    const salary = document.getElementById("salary").value;
    const salary_currency = document.getElementById("salary_currency").value;
    const salary_in_usd = document.getElementById("salary_in_usd").value;
    const employee_residence = document.getElementById("employee_residence").value;
    const remote_ratio = document.getElementById("remote_ratio").value;
    const company_location = document.getElementById("company_location").value;
    const company_size = document.getElementById("company_size").value;

    console.log(JSON.stringify({
        "_id": id,
        "work_year": work_year,
        "experience_level": experience_level,
        "employment_type": employment_type,
        "job_title": job_title,
        "salary": salary,
        "salary_currency": salary_currency,
        "salary_in_usd": salary_in_usd,
        "employee_residence": employee_residence,
        "remote_ratio": remote_ratio,
        "company_location": company_location,
        "company_size": company_size
    }));

    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "http://localhost:3000/salaries/update");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        "_id": id,
        "work_year": work_year,
        "experience_level": experience_level,
        "employment_type": employment_type,
        "job_title": job_title,
        "salary": salary,
        "salary_currency": salary_currency,
        "salary_in_usd": salary_in_usd,
        "employee_residence": employee_residence,
        "remote_ratio": remote_ratio,
        "company_location": company_location,
        "company_size": company_size
    }));
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            Swal.fire(
                'Good job!',
                'Update salaries Successfully!',
                'success'
            )
            loadTable();
        }
    };
}
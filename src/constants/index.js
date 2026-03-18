const navLinks = [
    {
        name: "Work",
        link: "#counter",
    },
    {
        name: "Experience",
        link: "#experience",
    },
    {
        name: "Skills",
        link: "#skills",
    },{
        name: "Education",
        link: "#education",
    },
    {
        name: "Contact",
        link: "#contact",
    },
];

const words = [
    { text: "Ideas", imgPath: "/images/ideas.svg" },
    { text: "Concepts", imgPath: "/images/concepts.svg" },
    { text: "Designs", imgPath: "/images/designs.svg" },
    { text: "Code", imgPath: "/images/code.svg" },
    { text: "Ideas", imgPath: "/images/ideas.svg" },
    { text: "Concepts", imgPath: "/images/concepts.svg" },
    { text: "Designs", imgPath: "/images/designs.svg" },
    { text: "Code", imgPath: "/images/code.svg" },
];

const counterItems = [
    { value: 8, suffix: "+", label: "Years of Experience" },
    { value: 6, suffix: "", label: "Domains" },
    { value: 8, suffix: "", label: "Clients & Employers" },
    { value: 100, suffix: "%", label: "Team Satisfaction" },
];

const skills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Redux",
    "Angular",
    "Next.js",
    "Java",
    "Spring Boot",
    "Hibernate",
    "Node.js",
    "Express",
    "Python",
    "Kotlin",
    "HTML5",
    "CSS3",
    "Bootstrap",
    "AWS",
    "MongoDB",
    "DynamoDB",
    "Redis",
    "DB2",
    "Redshift",
    "Kafka",
    "IBM MQ",
    "REST APIs",
    "Microservices",
    "CI/CD",
    "Docker",
    "Kubernetes",
    "Git",
    "Jenkins",
    "SonarQube",
    "Cypress",
    "Mocha",
    "JUnit",
    "ThreeJS",
    "React Three Fiber",
    "GSAP",
];

const abilities = [
    {
        imgPath: "/images/seo.png",
        title: "Large-Scale Frontend Engineering",
        desc: "Built high-impact Angular & React UIs at scale — including a 43% device take rate and a 25-point lift in successful transactions in production.",
    },
    {
        imgPath: "/images/chat.png",
        title: "Cloud-Native & Serverless Architecture on AWS",
        desc: "AWS runs through my entire career — Lambda, S3, EC2, API Gateway, DynamoDB, Redshift, CodePipeline, and serverless architectures serving hundreds of millions of records.",
    },
    {
        imgPath: "/images/time.png",
        title: "Enterprise Java Integration & Backend Systems",
        desc: "Deep experience in large enterprises, consulting firms, and government-adjacent roles — building event-driven Java/Spring Boot backends, IBM MQ pipelines, and SFTP automation handling 100,000+ files daily.",
    },
];

const techStackImgs = [
    {
        name: "Java",
        imgPath: "/images/logos/java.svg",
    },
    {
        name: "Angular",
        imgPath: "/images/logos/angular.svg",
    },
    {
        name: "React",
        imgPath: "/images/logos/react.png",
    },
    {
        name: "Backend",
        imgPath: "/images/logos/node.png",
    },
    {
        name: "Three JS",
        imgPath: "/images/logos/three.png",
    },

];

const techStackIcons = [
    {
        name: "JavaScript",
        modelPath: "/models/javascript-transformed.glb",
        scale: 1,
        rotation: [0, 0, 0],
    },
    {
        name: "TypeScript",
        modelPath: "/models/typescript-transformed.glb",
        scale: 1,
        rotation: [0, 0, 0],
    },
    {
        name: "Java",
        modelPath: "/models/java-transformed.glb",
        scale: 1,
        rotation: [0, 0, 0],
    },
    {
        name: "Angular",
        modelPath: "/models/angular-transformed.glb",
        scale: 1,
        rotation: [0, 0, 0],
    },
    {
        name: "React",
        modelPath: "/models/react_logo-transformed.glb",
        scale: 1,
        rotation: [0, 0, 0],
    },
    {
        name: "Next.js",
        modelPath: "/models/nextjs-transformed.glb",
        scale: 1,
        rotation: [0, 0, 0],
    },
    {
        name: "Node.js",
        modelPath: "/models/node-transformed.glb",
        scale: 5,
        rotation: [0, -Math.PI / 2, 0],
    },
    {
        name: "AWS",
        modelPath: "/models/aws-transformed.glb",
        scale: 0.8,
        rotation: [0, 0, 0],
    },
    {
        name: "Python",
        modelPath: "/models/python-transformed.glb",
        scale: 0.8,
        rotation: [0, 0, 0],
    },
    {
        name: "Spring Boot",
        modelPath: "/models/springboot-transformed.glb",
        scale: 1,
        rotation: [0, 0, 0],
    },
    {
        name: "MongoDB",
        modelPath: "/models/mongodb-transformed.glb",
        scale: 1,
        rotation: [0, 0, 0],
    },
    {
        name: "DynamoDB",
        modelPath: "/models/dynamodb-transformed.glb",
        scale: 1,
        rotation: [0, 0, 0],
    },
];

const expCards = [
    {
        review:
            "Contributed to DeltaSync Wi-Fi team delivering personalized onboard Wi-Fi experiences with Angular and dashboard solutions.",
        imgPath: "/images/exp4.png",
        logoPath: "/images/logo4.png",
        title: "Sr. Full Stack Developer – Delta Airlines",
        date: "September 2024 – Present",
        responsibilities: [
            "Lead a team of developers designing and building a management dashboard that enables dynamic deployment of application builds to aircraft onboard servers, streamlining fleet-wide updates.",
            "Developed Angular components for an updated onboard Wi-Fi UX that achieved a 43% device take rate and 24% customer engagement rate, exceeding the 2025 annual targets.",
            "Executed a major code repository migration involving 20,000+ lines of code with zero production downtime.",
        ],
    },
    {
        review:
            "Worked as a Senior Developer on system integrator team for Ohio Medicaid systems, building scalable Java solutions and automation tools.",
        imgPath: "/images/exp6.png",
        logoPath: "/images/logo6.png",
        title: "Sr. Java Developer – Deloitte Consulting",
        date: "January 2024 – August 2024",
        responsibilities: [
            "Engineered custom Java integrations between Ohio Department of Medicaid (ODM) and vendor systems including Aetna, Buckeye, DODD, and ODA as part of the statewide Medicaid system integration.",
            "Architected and delivered an SFTP-based automated file transfer solution using Progress MOVEit, processing 100,000+ files per day with high reliability.",
            "Implemented IBM MQ messaging for real-time data transfer between integrated systems, ensuring low-latency event-driven communication.",
        ],
    },
    {
        review:
            "Built project management tool with Next.js, TypeScript, and React UI to streamline repository and pipeline management.",
        imgPath: "/images/exp5.png",
        logoPath: "/images/logo5.png",
        title: "Java Developer – RiceFW Technologies",
        date: "July 2023 – December 2023",
        responsibilities: [
            "Owned the end-to-end development lifecycle of an internal project management tool — from stakeholder requirements gathering through design, implementation, and delivery.",
            "Built a Next.js/TypeScript backend with REST APIs, DAOs, and database entities to support repository management, pipeline visibility, and code quality reporting.",
            "Developed a React UI with Jenkins API integration for real-time CI/CD pipeline visibility and SonarQube code quality reporting, achieving 90%+ unit and integration test coverage.",
        ],
    },
    {
        review:
            "Developed Delta Exclusives Hub and onboard Wi-Fi personalization features with Angular and AWS integrations.",
        imgPath: "/images/exp4.png",
        logoPath: "/images/logo4.png",
        title: "Full Stack Developer – Delta Airlines",
        date: "February 2022 – July 2023",
        responsibilities: [
            "Designed a content framework for on-the-fly onboard Wi-Fi offer updates using Atomic Design Methodology in Angular, deployed across 25 flight tails with a roadmap for 500+ tails.",
            "Built AWS Lambda functions connecting the onboard server, client, and ground APIs from Delta's Loyalty, Retail, and Payments teams for a seamless in-flight experience.",
            "Delivered a responsive online check-in application with Cypress/Mocha automation tests, increasing successful transactions from 63% to 88% in production.",
        ],
    },
    {
        review:
            "Created robust cloud storage framework using modern technologies like Kotlin and TypeScript.",
        imgPath: "/images/exp3.png",
        logoPath: "/images/logo3.png",
        title: "Java Developer – CloudData Technology",
        date: "May 2021 – February 2022",
        responsibilities: [
            "Researched distributed infrastructure solutions and authored technical documentation on popular architectures.",
            "Designed a cloud storage architecture in Kotlin and TypeScript to serve as a reusable baseline for future client engagements.",
        ],
    },
    {
        review:
            "Worked on warranty management platform for Amazon devices with React frontend and Node backend.",
        imgPath: "/images/exp2.png",
        logoPath: "/images/logo2.png",
        title: "Software Development Engineer – Amazon",
        date: "July 2020 – May 2021",
        responsibilities: [
            "Designed an automation framework for onboarding device warranty configurations to the web catalog, reducing SLA from 3 weeks to seconds by leveraging existing internal tooling.",
            "Built a new multi-year warranty management platform with a React UI and Node.js backend, replacing a legacy system that managed 700M+ warranties.",
            "Supported client teams migrating from the legacy system to a new serverless architecture built on Lambda, API Gateway, DynamoDB, and Redshift.",
        ],
    },
    {
        review:
            "Contributed to Global Technology Infrastructure projects at JPMorgan with scalable REST APIs and microservices.",
        imgPath: "/images/exp1.svg",
        logoPath: "/images/logo1.png",
        title: "Infrastructure Software Engineer – JPMorgan Chase",
        date: "July 2016 – May 2018",
        responsibilities: [
            "Designed and built RESTful microservices in Java/Spring Boot to manage storage resources for 7,000+ internal applications, with session management via Redis.",
            "Developed an interactive tool enabling non-technical teams to manage enterprise-grade AWS S3 storage (Dell EMC).",
            "Achieved 95% unit test coverage following Test-Driven Development (TDD) using JUnit.",
        ],
    },
];

const expLogos = [
    { name: "Delta Airlines", imgPath: "/images/logo4.png" },
    { name: "Deloitte", imgPath: "/images/logo6.png" },
    { name: "RiceFW Technologies", imgPath: "/images/logo5.png" },
    { name: "Delta Airlines", imgPath: "/images/logo4.png" },
    { name: "CloudData Technology", imgPath: "/images/logo3.png" },
    { name: "Amazon", imgPath: "/images/logo2.png" },
    { name: "JPMorgan Chase", imgPath: "/images/logo1.png" },
];

const educationLocations = [
    {
        id: 1,
        name: "University of Florida",
        degree: "M.S. in Computer Science",
        years: "2018 – 2020",
        location: "Gainesville, FL, USA",
        imgPath: "/images/edu2.png",
        logoPath: "/images/edu-logo2.png",
        lat: 29.6516,
        lng: -82.3248,
        color: "#FA4616",       // UF Orange
        accentDark: "#003087",  // UF Blue
        highlights: ["Machine Learning", "Distributed Systems", "Analysis of Algorithms", "Advanced Data Structures", "Computer Networks"],
        Capstone: "Implementation of real-time Object Detection using YOLOv3 (CNN) trained on the COCO dataset (80 classes)",
    },
    {
        id: 2,
        name: "VIT University",
        degree: "B.Tech in Information Technology",
        years: "2012 – 2016",
        location: "Vellore, India",
        imgPath: "/images/edu1.png",
        logoPath: "/images/edu-logo1.png",
        lat: 12.9165,
        lng: 79.1325,
        color: "#003FA5",       // VIT Blue
        accentDark: "#C8972B",  // VIT Gold
        highlights: ["Data Structures and algorithms", "Object Oriented Programing Concepts", "Database Management Systems", "Computer Architecture"],
        Capstone: "Package carrying rover with GPS routing, RFID recognition for package release",
    },
];

const socialImgs = [
    {
        name: "linkedin",
        url: "https://www.linkedin.com/bhasanth/",
        imgPath: "/images/linkedin.png",
    },
];

export {
    words,
    abilities,
    skills,
    counterItems,
    expCards,
    expLogos,
    socialImgs,
    techStackIcons,
    techStackImgs,
    navLinks,
    educationLocations,
};
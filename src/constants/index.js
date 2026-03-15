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
    { value: 100, suffix: "%", label: "Satisfaction" },
];

const logoIconsList = [
    {
        imgPath: "/images/logos/company-logo-1.png",
    },
    {
        imgPath: "/images/logos/company-logo-2.png",
    },
    {
        imgPath: "/images/logos/company-logo-3.png",
    },
    {
        imgPath: "/images/logos/company-logo-4.png",
    },
    {
        imgPath: "/images/logos/company-logo-5.png",
    },
    {
        imgPath: "/images/logos/company-logo-6.png",
    },
    {
        imgPath: "/images/logos/company-logo-7.png",
    },
    {
        imgPath: "/images/logos/company-logo-8.png",
    },
];

const abilities = [
    {
        imgPath: "/images/seo.png",
        title: "Large-Scale Frontend Engineering",
        desc: "I build frontends people actually use — at 30,000 feet.",
    },
    {
        imgPath: "/images/chat.png",
        title: "Cloud-Native & Serverless Architecture on AWS",
        desc: "AWS runs through my entire career — Lambda, S3, EC2, API Gateway, DynamoDB, Redshift, CodePipeline",
    },
    {
        imgPath: "/images/time.png",
        title: "Enterprise Java Integration & Backend Systems",
        desc: "Experience working at large enterprises, consulting firms, and government-adjacent roles",
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
            "Developed Angular components boosting engagement rates.",
            "Led code repository migration with 20,000+ LOC.",
            "Leading team to design management dashboard for aircraft servers.",
        ],
    },
    {
        review:
            "Worked as a Senior Developer on system integrator tean for Ohio Medicaid systems, building scalable Java solutions and automation tools.",
        imgPath: "/images/exp6.png",
        logoPath: "/images/logo6.png",
        title: "Sr. Java Developer – Deloitte Consulting",
        date: "January 2024 – August 2024",
        responsibilities: [
            "Developed custom Java interfaces between vendors.",
            "Built automated SFTP transfer solution handling 100k+ files daily.",
            "Created Python scripts to reconcile transactional data.",
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
            "Developed backend APIs with Next.js & Jenkins API.",
            "Built React UI for repository and pipeline management.",
            "Maintained CI/CD pipelines and SonarQube integration.",
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
            "Designed framework for dynamic onboard Wi-Fi content updates.",
            "Integrated Angular UI with AMEX, Paramount+, T-Mobile APIs.",
            "Built AWS Lambdas to connect onboard servers and ground APIs.",
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
            "Designed baseline architecture for cloud storage.",
            "Researched distributed infrastructure solutions.",
            "Developed core storage modules with TypeScript & Kotlin.",
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
            "Built automation framework to onboard device warranty configurations.",
            "Developed warranty platform with React, Node, Lambda, DynamoDB.",
            "Provided support for legacy system managing 700M+ warranties.",
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
            "Designed microservices with Spring Boot and Java.",
            "Built REST APIs for storage management across 7000+ apps.",
            "Developed AWS S3 interface tool for non-technical teams.",
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

const socialImgs = [
    // {
    //     name: "insta",
    //     url: "https://www.instagram.com/",
    //     imgPath: "/images/insta.png",
    // },
    // {
    //     name: "fb",
    //     url: "https://www.facebook.com/",
    //     imgPath: "/images/fb.png",
    // },
    // {
    //     name: "x",
    //     url: "https://www.x.com/",
    //     imgPath: "/images/x.png",
    // },
    {
        name: "linkedin",
        url: "https://www.linkedin.com/bhasanth/",
        imgPath: "/images/linkedin.png",
    },
];

export {
    words,
    abilities,
    logoIconsList,
    counterItems,
    expCards,
    expLogos,
    socialImgs,
    techStackIcons,
    techStackImgs,
    navLinks,
};

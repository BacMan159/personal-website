const navLinks = [
    {
        name: "Work",
        link: "#work",
    },
    {
        name: "Experience",
        link: "#experience",
    },
    {
        name: "Skills",
        link: "#skills",
    },
    {
        name: "Testimonials",
        link: "#testimonials",
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
    { value: 7, suffix: "+", label: "Years of Experience" },
    { value: 20, suffix: "+", label: "Completed Projects" },
    { value: 10, suffix: "+", label: "Clients & Employers" },
    { value: 90, suffix: "%", label: "Client Satisfaction" },
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
    {
        imgPath: "/images/logos/company-logo-9.png",
    },
    {
        imgPath: "/images/logos/company-logo-10.png",
    },
    {
        imgPath: "/images/logos/company-logo-11.png",
    },
];

const abilities = [
    {
        imgPath: "/images/seo.png",
        title: "Quality Focus",
        desc: "Delivering high-quality results while maintaining attention to every detail.",
    },
    {
        imgPath: "/images/chat.png",
        title: "Reliable Communication",
        desc: "Keeping you updated at every step to ensure transparency and clarity.",
    },
    {
        imgPath: "/images/time.png",
        title: "On-Time Delivery",
        desc: "Making sure projects are completed on schedule, with quality & attention to detail.",
    },
];

const techStackImgs = [
    {
        name: "React Developer",
        imgPath: "/images/logos/react.png",
    },
    {
        name: "Python Developer",
        imgPath: "/images/logos/python.svg",
    },
    {
        name: "Backend Developer",
        imgPath: "/images/logos/node.png",
    },
    {
        name: "Interactive Developer",
        imgPath: "/images/logos/three.png",
    },
    {
        name: "Project Manager",
        imgPath: "/images/logos/git.svg",
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
        imgPath: "/images/exp1.png",
        logoPath: "/images/logo1.png",
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
        imgPath: "/images/exp2.png",
        logoPath: "/images/logo2.png",
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
        imgPath: "/images/exp3.png",
        logoPath: "/images/logo3.png",
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
        imgPath: "/images/exp5.png",
        logoPath: "/images/logo5.png",
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
        imgPath: "/images/exp6.png",
        logoPath: "/images/logo6.png",
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
        imgPath: "/images/exp7.png",
        logoPath: "/images/logo7.png",
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
    { name: "Delta Airlines", imgPath: "/images/logo1.png" },
    { name: "Deloitte", imgPath: "/images/logo2.png" },
    { name: "RiceFW Technologies", imgPath: "/images/logo3.png" },
    { name: "Delta Airlines", imgPath: "/images/logo4.png" },
    { name: "CloudData Technology", imgPath: "/images/logo5.png" },
    { name: "Amazon", imgPath: "/images/logo6.png" },
    { name: "JPMorgan Chase", imgPath: "/images/logo7.png" },
];

const testimonials = [
    {
        name: "Esther Howard",
        mentions: "@estherhoward",
        review:
            "I can’t say enough good things about Adrian. He was able to take our complex project requirements and turn them into a seamless, functional website. His problem-solving abilities are outstanding.",
        imgPath: "/images/client1.png",
    },
    {
        name: "Wade Warren",
        mentions: "@wadewarren",
        review:
            "Working with Adrian was a fantastic experience. He transformed our outdated website into a modern, user-friendly platform. His attention to detail and commitment to quality are unmatched. Highly recommend him for any web dev projects.",
        imgPath: "/images/client3.png",
    },
    {
        name: "Guy Hawkins",
        mentions: "@guyhawkins",
        review:
            "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
        imgPath: "/images/client2.png",
    },
    {
        name: "Marvin McKinney",
        mentions: "@marvinmckinney",
        review:
            "Adrian was a pleasure to work with. He turned our outdated website into a fresh, intuitive platform that’s both modern and easy to navigate. Fantastic work overall.",
        imgPath: "/images/client5.png",
    },
    {
        name: "Floyd Miles",
        mentions: "@floydmiles",
        review:
            "Adrian’s expertise in web development is truly impressive. He delivered a robust and scalable solution for our e-commerce site, and our online sales have significantly increased since the launch. He’s a true professional!",
        imgPath: "/images/client4.png",
    },
    {
        name: "Albert Flores",
        mentions: "@albertflores",
        review:
            "Adrian was a pleasure to work with. He understood our requirements perfectly and delivered a website that exceeded our expectations. His skills in both frontend and backend dev are top-notch.",
        imgPath: "/images/client6.png",
    },
];

const socialImgs = [
    {
        name: "insta",
        url: "https://www.instagram.com/",
        imgPath: "/images/insta.png",
    },
    {
        name: "fb",
        url: "https://www.facebook.com/",
        imgPath: "/images/fb.png",
    },
    {
        name: "x",
        url: "https://www.x.com/",
        imgPath: "/images/x.png",
    },
    {
        name: "linkedin",
        url: "https://www.linkedin.com/",
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
    testimonials,
    socialImgs,
    techStackIcons,
    techStackImgs,
    navLinks,
};

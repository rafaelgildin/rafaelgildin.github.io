// Add smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Function to handle mouse movement on elements
function handleMouseMove(e, element) {
    const rect = element.getBoundingClientRect();
    
    // Get mouse position relative to the element
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert position to percentage (-50 to 50)
    const xPercent = ((x / rect.width) * 100 - 50) * 0.5;
    const yPercent = ((y / rect.height) * 100 - 50) * 0.5;
    
    // Apply transform
    element.style.transform = `perspective(1000px) rotateX(${-yPercent}deg) rotateY(${xPercent}deg) scale3d(1.02, 1.02, 1.02)`;
}

// Function to reset element position
function resetPosition(element) {
    element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
}

// Function to adjust grid layout based on number of items
function adjustGridLayout() {
    const grid = document.querySelector('.experience-grid');
    const items = grid.children.length;
    
    if (items % 2 === 0) {
        grid.classList.add('even');
    } else {
        grid.classList.remove('even');
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', adjustGridLayout);

document.addEventListener('DOMContentLoaded', function() {
    const rippleSettings = {
        maxSize: 100,
        animationSpeed: 5,
        strokeColor: [148, 217, 255],
    };

    const canvasSettings = {
        blur: 8,
        ratio: 1,
    };

    function Coords(x, y) {
        this.x = x || null;
        this.y = y || null;
    }

    const Ripple = function Ripple(x, y, circleSize, ctx) {
        this.position = new Coords(x, y);
        this.circleSize = circleSize;
        this.maxSize = rippleSettings.maxSize;
        this.opacity = 1;
        this.ctx = ctx;
        this.strokeColor = `rgba(${Math.floor(rippleSettings.strokeColor[0])},
            ${Math.floor(rippleSettings.strokeColor[1])},
            ${Math.floor(rippleSettings.strokeColor[2])},
            ${this.opacity})`;

        this.animationSpeed = rippleSettings.animationSpeed;
        this.opacityStep = (this.animationSpeed / (this.maxSize - circleSize)) / 2;
    };

    Ripple.prototype = {
        update: function update() {
            this.circleSize = this.circleSize + this.animationSpeed;
            this.opacity = this.opacity - this.opacityStep;
            this.strokeColor = `rgba(${Math.floor(rippleSettings.strokeColor[0])},
                ${Math.floor(rippleSettings.strokeColor[1])},
                ${Math.floor(rippleSettings.strokeColor[2])},
                ${this.opacity})`;
        },
        draw: function draw() {
            this.ctx.beginPath();
            this.ctx.strokeStyle = this.strokeColor;
            this.ctx.arc(this.position.x, this.position.y, this.circleSize, 0, 2 * Math.PI);
            this.ctx.stroke();
        }
    };

    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('2d');
    const ripples = [];

    function initCanvas() {
        const height = document.body.clientHeight;
        const width = document.body.clientWidth;
        
        canvas.style.filter = `blur(${canvasSettings.blur}px)`;
        canvas.width = width * canvasSettings.ratio;
        canvas.height = height * canvasSettings.ratio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
    }

    function canvasMouseOver(e) {
        const x = e.clientX * canvasSettings.ratio;
        const y = (e.clientY + window.scrollY) * canvasSettings.ratio;
        ripples.unshift(new Ripple(x, y, 2, ctx));
    }

    function animation() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const length = ripples.length;
        for (let i = length - 1; i >= 0; i -= 1) {
            const r = ripples[i];
            r.update();
            r.draw();

            if (r.opacity <= 0) {
                ripples[i] = null;
                delete ripples[i];
                ripples.pop();
            }
        }
        requestAnimationFrame(animation);
    }

    // Initialize
    initCanvas();
    animation();

    // Event listeners
    window.addEventListener('resize', initCanvas);
    document.addEventListener('mousemove', canvasMouseOver);

    // Keep profile photo 3D effect
    const profilePhoto = document.querySelector('.profile-photo.logo');
    if (profilePhoto) {
        profilePhoto.addEventListener('mousemove', (e) => {
            e.stopPropagation();
            handleMouseMove(e, profilePhoto);
        });
        profilePhoto.addEventListener('mouseleave', () => resetPosition(profilePhoto));
    }

    const skillDescriptions = {
        'Machine Learning': 'A branch of AI that enables computers to learn from data and improve from experience without explicit programming. Used for predictions, recommendations, and pattern recognition in data.',
        'Data Science': 'The art of extracting meaningful insights from data using statistics, programming, and domain knowledge. Helps businesses make data-driven decisions.',
        'Python': 'A versatile programming language known for its simplicity and powerful libraries. Essential for data analysis, machine learning, and web development.',
        'Google Cloud Platform': 'A suite of cloud computing services for building, deploying, and scaling applications. Includes tools for data storage, machine learning, and analytics.',
        'Data Visualization': 'The art of presenting data graphically to identify patterns and communicate insights effectively. Uses tools like charts, graphs, and interactive dashboards.',
        'Deep Learning': 'A subset of machine learning using neural networks to mimic human brain function. Powers image recognition, natural language processing, and AI applications.',
        'Data Engineering': 'The practice of designing and building systems for collecting, storing, and analyzing data at scale. Creates data pipelines and infrastructure.',
        'SQL': 'Structured Query Language for managing and analyzing relational databases. Essential for data manipulation and extraction.'
    };

    document.querySelectorAll('.skill').forEach(skill => {
        const skillName = skill.textContent.trim();
        const tooltip = document.createElement('div');
        tooltip.className = 'skill-tooltip';
        tooltip.textContent = skillDescriptions[skillName];
        skill.appendChild(tooltip);
    });
}); 
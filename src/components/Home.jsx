import React from "react";
import "../css/Home.css";
import hero from "../assets/images/hero.png";
import business from "../assets/images/business-studies.png";
import accounts from "../assets/images/accounts.png";
import classes from "../assets/images/everyClass.png";

const Home = () => {
  return (
    <div id="home">
      {/* Header */}
      <aside id="header">
        <div id="container">
          <a href="/" id="logo">
            <h2>Commerce Gyan Academy</h2>
          </a>

          <nav id="nav-btns">
            <a href="#hero">
              <span className="material-symbols-outlined">home</span> Home
            </a>
            <a href="#about">
              <span className="material-symbols-outlined">info</span> About Us
            </a>
            <a href="#courses">
              <span class="material-symbols-outlined">school</span> Courses
            </a>
            <a href="#faculty">
              <span class="material-symbols-outlined">group</span> Faculty
            </a>
            <a href="#testimonials">
              <span class="material-symbols-outlined">reviews</span>
              Testimonials
            </a>
            <a href="#contact">
              <span class="material-symbols-outlined">contact_support</span>
              Contact Us
            </a>
          </nav>
        </div>

        <div id="get-started">
          <a href="#enroll">Enroll Now</a>
        </div>
      </aside>

      <main id="main-content">
        {/* Hero Section */}
        <section id="hero">
          <div id="container">
            <div id="hero-text">
              <h1>Master Commerce with Confidence</h1>
              <p>
                Your trusted academy for Commerce education and career success.
              </p>
              <div id="hero-btn">
                <a href="#enroll">Enroll Now</a>
                <a href="#more">Learn more</a>
              </div>
            </div>
            <img src={hero} alt="hero" />
          </div>
        </section>

        {/* About us */}
        <section id="about-academy">
          <div id="container">
            <h1>About the Academy</h1>
            <p>
              Commerce Gyan Academy is dedicated to providing high-quality
              commerce education to students aspiring for successful careers in
              the field. Our experienced faculty and structured curriculum
              ensure comprehensive learning and career readiness.
            </p>
          </div>
        </section>

        {/* Why Choose Us */}
        <section id="popular-courses">
          <h1>Popular Courses</h1>
          <div id="container">
            <div id="choose-card">
              <img src={accounts} alt="" />
              <h3>Accounting Fundamentals</h3>
              <p>Learn the basics of accounting</p>
            </div>
            <div id="choose-card">
              <img src={business} alt="" />
              <h3>Business Studies</h3>
              <p>Learn class 11th and 12th Business</p>
            </div>
            <div id="choose-card">
              <img src={classes} alt="" />
              <h3>Class 1st to Class 12th</h3>
              <p>Every Subject</p>
            </div>
          </div>
        </section>

        {/* Why choose us */}
        <section id="why-choose-us">
          <div id="container">
            <div>
              <h1>Why choose us ?</h1>
              <p>
                We offer a unique blend of expert teaching, a structured
                curriculum, and dedicated career guidance to ensure your success
                in the commerce field.
              </p>
            </div>
            <div id="cards">
              <div id="card-wrap">
                <span class="material-symbols-outlined">school</span>
                <h2>Expert Faculty</h2>
                <p>Learn from experienced commerce professionals</p>
              </div>
              <div id="card-wrap">
                <span class="material-symbols-outlined">bar_chart</span>
                <h2>Structured Curriculum</h2>
                <p>Comprehensive and well-organized course content</p>
              </div>
              <div id="card-wrap">
                <span class="material-symbols-outlined">work</span>
                <h2>Career Guidance</h2>
                <p>Get support for career planning and placement</p>
              </div>
            </div>
          </div>
        </section>

        
        {/* Student testimonials */}

        {/* Results */}
        <section id="demo">
          <div id="container">
            <h1>Ready to start your journey</h1>
            <p>Book a free demo session and experience our teaching methodology firsthand.</p>
            <a href="#home">Book a free demo</a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;

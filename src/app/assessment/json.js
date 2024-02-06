export const json = {
  "title": "Student Assessment Form",
  "logoPosition": "right",
  "completedHtml": "<h4>Thank you for completing the survey!</h4>\n<br />\n<p>You may now close this window/tab.</p>",
  "completedBeforeHtml": "<h4>Our records show that you have already completed this survey.</h4>",
  "loadingHtml": "<h4>Loading Survey...</h4>",
  "pages": [
   {
    "name": "page1",
    "elements": [
     {
      "type": "html",
      "name": "consentMessage",
      "html": "<h4>Introduction</h4>\n<p>You are invited to participate in the development and implementation of a groundbreaking <b>Student Mental Health Data Analysis and Monitoring System Using Generative AI</b> at the Polytechnic University of the Philippines Santa Rosa Campus. This innovative solution aims to transform the way we assist the well-being of students by:\n</p>\n<br />\n<li><b>Proactively identifying mental health status:</b> Through anonymized data analysis of surveys and app interactions, the system can flag students potentially struggling emotionally, enabling early intervention.</li>\n<li><b>Offering personalized support and resources:</b> Based on identified needs, the system can recommend relevant mental health resources and connect students with appropriate support services, promoting timely and targeted assistance</li>\n<li><b>Gaining deeper analysis into student mental health:</b> The collected data will offer valuable insights into the mental health landscape of PUP Santa Rosa students, informing future initiatives and tailoring support programs to better\nserve your needs.</li>\n<br />\n<h4>Your Participation</h4>\n<p>By choosing to participate, you are giving importance to your mental health and it will play a vital role in shaping this system. Your contribution may involve:</p>\n<br />\n<li>Completing brief data-secured surveys about your mental health and well-being.</li>\n<li><b>You will answer the same set of questions three times over a two-month period.</b> Each questionnaire takes <b>approximately 3-5 minutes to complete.</b></li>\n<li>You will receive email notifications every two weeks reminding you to complete the latest questionnaire.</li>\n<li>Providing feedback on the system's design and functionality through surveys.</li>\n<br />\n<h4>Significance for the University and Students</h4>\n<p>Your participation holds immense significance in our advocacy to give importance to mental health of every students in PUP Santa Rosa Campus.</p>\n<br />\n<h5 style=\"font-size: 18px;\">For the University</h5>\n<li><b>Enhanced student well-being:</b> The system aims to create a more supportive environment for students by facilitating early identification and intervention for mental health concerns, ultimately leading to a healthier and more thriving student body.</li>\n<li><b>Data-driven decision-making:</b> The insights gained from the system will inform the development of more effective and targeted mental health services and initiatives, ensuring resources are allocated where they are most needed.</li>\n<li><b>Positive reputation and impact:</b> By pioneering this innovative approach to student mental health support, PUP Santa Rosa can set a national example and contribute to a wider conversation about prioritizing student well-being in higher education.</li>\n<br />\n<h5 style=\"font-size: 18px;\">For Students</h5>\n<li><b>Improved access to support:</b> The system promises faster and easier access to relevant mental health resources, reducing barriers and encouraging students to seek help without delay.</li>\n<li><b>Personalized care:</b> You will receive recommendations and interventions tailored to your specific needs, ensuring you get the support that works best for you.\n</li>\n<li><b>Positive impact on academic performance and overall well-being:</b> Timely access to mental health support can significantly improve academic performance, social interactions, and overall well-being throughout your studies.</li>\n<br />\n<h5>Voluntary Participation</h5>\n<p>Participation is entirely voluntary. You have the right to refuse or withdraw your consent at any time without penalty.</p>\n<br />\n<h5>Confidentiality and Anonymity</h5>\n<p>All data collected will be anonymized, meaning your personal information will not be identifiable. We will take all necessary steps to protect the confidentiality of your data.</p>\n<br />\n<h5>Risks and Benefits</h5>\n<p>There are no foreseen risks associated with participating. However, some individuals may find answering questions about their mental health to be emotionally challenging. If you experience any discomfort, please feel free to stop participating or seek support from available resources.</p>\n<p>The potential benefits of your participation include contributing to a more supportive campus environment, receiving personalized mental health support, and shaping a system that can benefit future generations of students.</p>\n<br />\n<h5>Additional Information</h5>\n<li>This proposed research study has been submitted to the <b>University Research Ethics Center (UREC).</b></li>\n<li>The proposed system uses the <b>APA DSM-5-TR Self-Rated Level 1 Cross-Cutting Symptom Measure - Adult</b> to understand mental health trends among students and improve available resources.</li>\n<br />\n<h5>Contact Information</h5>\n<p>For any questions or concerns about this project, please contact:</p>\n<br />\n<p>Engr. Emy Lou G. Alinsod/ <a href=\"mailto:egalinsod@pup.edu.ph\">egalinsod@pup.edu.ph</a></p>\n<p><i>Project Team Lead</i></p>\n<br />\n<h5>Consent</h5>\n<p><i>Click on the <b>\"I Agree\"</b> button to indicate that you have read and understood this informed consent form and voluntarily agree to participate in this development project.</i></p>\n<br />\n<p><b>Thank you for considering participation in this project.</b></p>\n<p><b>Your contribution is greatly appreciated.</b></p>"
     }
    ]
   },
   {
    "name": "page2",
    "elements": [
     {
      "type": "html",
      "name": "instructions",
      "html": "<p>During the past TWO (2) WEEKS, how much (or how often) have you been bothered by the following problems?</p>\n<br />\n<li><b>Not at all: </b>No experience at all within the past two weeks.</li>\n<li><b>Slight: </b>Rare, less than a day or two.</li>\n<li><b>Mild: </b>Several days.</li>\n<li><b>Moderate: </b>More than half the days.</li>\n<li><b>Severe: </b>Nearly every day.</li>"
     },
     {
      "type": "rating",
      "name": "assessment1",
      "title": "Little interest or pleasure in doing things?",
      "isRequired": true,
      "autoGenerate": false,
      "rateValues": [
       {
        "value": "0",
        "text": "Not at all"
       },
       {
        "value": "1",
        "text": "Slight"
       },
       {
        "value": "2",
        "text": "Mild"
       },
       {
        "value": "3",
        "text": "Moderate"
       },
       {
        "value": "4",
        "text": "Severe"
       }
      ]
     },
     {
      "type": "rating",
      "name": "assessment2",
      "title": "Feeling down, depressed, or hopeless?",
      "isRequired": true,
      "autoGenerate": false,
      "rateValues": [
       {
        "value": "0",
        "text": "Not at all"
       },
       {
        "value": "1",
        "text": "Slight"
       },
       {
        "value": "2",
        "text": "Mild"
       },
       {
        "value": "3",
        "text": "Moderate"
       },
       {
        "value": "4",
        "text": "Severe"
       }
      ]
     },
     {
      "type": "rating",
      "name": "assessment3",
      "title": "Feeling more irritated, grouchy, or angry than usual?",
      "isRequired": true,
      "autoGenerate": false,
      "rateValues": [
       {
        "value": "0",
        "text": "Not at all"
       },
       {
        "value": "1",
        "text": "Slight"
       },
       {
        "value": "2",
        "text": "Mild"
       },
       {
        "value": "3",
        "text": "Moderate"
       },
       {
        "value": "4",
        "text": "Severe"
       }
      ]
     },
     {
      "type": "rating",
      "name": "assessment4",
      "title": "Sleeping less than usual, but still have a lot of energy?",
      "isRequired": true,
      "autoGenerate": false,
      "rateValues": [
       {
        "value": "0",
        "text": "Not at all"
       },
       {
        "value": "1",
        "text": "Slight"
       },
       {
        "value": "2",
        "text": "Mild"
       },
       {
        "value": "3",
        "text": "Moderate"
       },
       {
        "value": "4",
        "text": "Severe"
       }
      ]
     },
     {
      "type": "rating",
      "name": "assessment5",
      "title": "Starting lots more projects than usual or doing more risky things than usual?",
      "isRequired": true,
      "autoGenerate": false,
      "rateValues": [
       {
        "value": "0",
        "text": "Not at all"
       },
       {
        "value": "1",
        "text": "Slight"
       },
       {
        "value": "2",
        "text": "Mild"
       },
       {
        "value": "3",
        "text": "Moderate"
       },
       {
        "value": "4",
        "text": "Severe"
       }
      ]
     },
     {
      "type": "rating",
      "name": "assessment6",
      "title": "Feeling nervous, anxious, frightened, worried, or on edge?",
      "isRequired": true,
      "autoGenerate": false,
      "rateValues": [
       {
        "value": "0",
        "text": "Not at all"
       },
       {
        "value": "1",
        "text": "Slight"
       },
       {
        "value": "2",
        "text": "Mild"
       },
       {
        "value": "3",
        "text": "Moderate"
       },
       {
        "value": "4",
        "text": "Severe"
       }
      ]
     },
     {
      "type": "rating",
      "name": "assessment7",
      "title": "Feeling panic or being frightened?",
      "isRequired": true,
      "autoGenerate": false,
      "rateValues": [
       {
        "value": "0",
        "text": "Not at all"
       },
       {
        "value": "1",
        "text": "Slight"
       },
       {
        "value": "2",
        "text": "Mild"
       },
       {
        "value": "3",
        "text": "Moderate"
       },
       {
        "value": "4",
        "text": "Severe"
       }
      ]
     },
     {
      "type": "rating",
      "name": "assessment8",
      "title": "Avoiding situations that make you anxious?",
      "isRequired": true,
      "autoGenerate": false,
      "rateValues": [
       {
        "value": "0",
        "text": "Not at all"
       },
       {
        "value": "1",
        "text": "Slight"
       },
       {
        "value": "2",
        "text": "Mild"
       },
       {
        "value": "3",
        "text": "Moderate"
       },
       {
        "value": "4",
        "text": "Severe"
       }
      ]
     },
     {
      "type": "rating",
      "name": "assessment9",
      "title": "Unexplained aches and pains (e.g., head, back, joints, abdomen, legs)?",
      "isRequired": true,
      "autoGenerate": false,
      "rateValues": [
       {
        "value": "0",
        "text": "Not at all"
       },
       {
        "value": "1",
        "text": "Slight"
       },
       {
        "value": "2",
        "text": "Mild"
       },
       {
        "value": "3",
        "text": "Moderate"
       },
       {
        "value": "4",
        "text": "Severe"
       }
      ]
     },
     {
      "type": "rating",
      "name": "assessment10",
      "title": "Feeling that your illnesses are not being taken seriously enough?",
      "isRequired": true,
      "autoGenerate": false,
      "rateValues": [
       {
        "value": "0",
        "text": "Not at all"
       },
       {
        "value": "1",
        "text": "Slight"
       },
       {
        "value": "2",
        "text": "Mild"
       },
       {
        "value": "3",
        "text": "Moderate"
       },
       {
        "value": "4",
        "text": "Severe"
       }
      ]
     },
     {
      "type": "rating",
      "name": "assessment11",
      "title": "Thoughts of actually hurting yourself?",
      "isRequired": true,
      "autoGenerate": false,
      "rateValues": [
       {
        "value": "0",
        "text": "Not at all"
       },
       {
        "value": "1",
        "text": "Slight"
       },
       {
        "value": "2",
        "text": "Mild"
       },
       {
        "value": "3",
        "text": "Moderate"
       },
       {
        "value": "4",
        "text": "Severe"
       }
      ]
     },
     {
      "type": "rating",
      "name": "assessment12",
      "title": "Hearing things other people couldn’t hear, such as voices even when no one was around?",
      "isRequired": true,
      "autoGenerate": false,
      "rateValues": [
       {
        "value": "0",
        "text": "Not at all"
       },
       {
        "value": "1",
        "text": "Slight"
       },
       {
        "value": "2",
        "text": "Mild"
       },
       {
        "value": "3",
        "text": "Moderate"
       },
       {
        "value": "4",
        "text": "Severe"
       }
      ]
     },
     {
      "type": "rating",
      "name": "assessment13",
      "title": "Feeling that someone could hear your thoughts, or that you could hear what another person was thinking?",
      "isRequired": true,
      "autoGenerate": false,
      "rateValues": [
       {
        "value": "0",
        "text": "Not at all"
       },
       {
        "value": "1",
        "text": "Slight"
       },
       {
        "value": "2",
        "text": "Mild"
       },
       {
        "value": "3",
        "text": "Moderate"
       },
       {
        "value": "4",
        "text": "Severe"
       }
      ]
     },
     {
      "type": "rating",
      "name": "assessment14",
      "title": "Problems with sleep that affected your sleep quality over all?",
      "isRequired": true,
      "autoGenerate": false,
      "rateValues": [
       {
        "value": "0",
        "text": "Not at all"
       },
       {
        "value": "1",
        "text": "Slight"
       },
       {
        "value": "2",
        "text": "Mild"
       },
       {
        "value": "3",
        "text": "Moderate"
       },
       {
        "value": "4",
        "text": "Severe"
       }
      ]
     },
     {
      "type": "rating",
      "name": "assessment15",
      "title": "Problems with memory (e.g., learning new information) or with location (e.g., finding your way home)?",
      "isRequired": true,
      "autoGenerate": false,
      "rateValues": [
       {
        "value": "0",
        "text": "Not at all"
       },
       {
        "value": "1",
        "text": "Slight"
       },
       {
        "value": "2",
        "text": "Mild"
       },
       {
        "value": "3",
        "text": "Moderate"
       },
       {
        "value": "4",
        "text": "Severe"
       }
      ]
     },
     {
      "type": "rating",
      "name": "assessment16",
      "title": "Unpleasant thoughts, urges, or images that repeatedly enter your mind?",
      "isRequired": true,
      "autoGenerate": false,
      "rateValues": [
       {
        "value": "0",
        "text": "Not at all"
       },
       {
        "value": "1",
        "text": "Slight"
       },
       {
        "value": "2",
        "text": "Mild"
       },
       {
        "value": "3",
        "text": "Moderate"
       },
       {
        "value": "4",
        "text": "Severe"
       }
      ]
     },
     {
      "type": "rating",
      "name": "assessment17",
      "title": "Feeling driven to perform certain behaviors or mental acts over and over again?",
      "isRequired": true,
      "autoGenerate": false,
      "rateValues": [
       {
        "value": "0",
        "text": "Not at all"
       },
       {
        "value": "1",
        "text": "Slight"
       },
       {
        "value": "2",
        "text": "Mild"
       },
       {
        "value": "3",
        "text": "Moderate"
       },
       {
        "value": "4",
        "text": "Severe"
       }
      ]
     },
     {
      "type": "rating",
      "name": "assessment18",
      "title": "Feeling detached or distant from yourself, your body, your physical surroundings, or your memories?",
      "isRequired": true,
      "autoGenerate": false,
      "rateValues": [
       {
        "value": "0",
        "text": "Not at all"
       },
       {
        "value": "1",
        "text": "Slight"
       },
       {
        "value": "2",
        "text": "Mild"
       },
       {
        "value": "3",
        "text": "Moderate"
       },
       {
        "value": "4",
        "text": "Severe"
       }
      ]
     },
     {
      "type": "rating",
      "name": "assessment19",
      "title": "Not knowing who you really are or what you want out of life?",
      "isRequired": true,
      "autoGenerate": false,
      "rateValues": [
       {
        "value": "0",
        "text": "Not at all"
       },
       {
        "value": "1",
        "text": "Slight"
       },
       {
        "value": "2",
        "text": "Mild"
       },
       {
        "value": "3",
        "text": "Moderate"
       },
       {
        "value": "4",
        "text": "Severe"
       }
      ]
     },
     {
      "type": "rating",
      "name": "assessment20",
      "title": "Not feeling close to other people or enjoying your relationships with them?",
      "isRequired": true,
      "autoGenerate": false,
      "rateValues": [
       {
        "value": "0",
        "text": "Not at all"
       },
       {
        "value": "1",
        "text": "Slight"
       },
       {
        "value": "2",
        "text": "Mild"
       },
       {
        "value": "3",
        "text": "Moderate"
       },
       {
        "value": "4",
        "text": "Severe"
       }
      ]
     },
     {
      "type": "rating",
      "name": "assessment21",
      "title": ". Drinking at least 4 drinks of any kind of alcohol in a single day?",
      "isRequired": true,
      "autoGenerate": false,
      "rateValues": [
       {
        "value": "0",
        "text": "Not at all"
       },
       {
        "value": "1",
        "text": "Slight"
       },
       {
        "value": "2",
        "text": "Mild"
       },
       {
        "value": "3",
        "text": "Moderate"
       },
       {
        "value": "4",
        "text": "Severe"
       }
      ]
     },
     {
      "type": "rating",
      "name": "assessment22",
      "title": "Smoking any cigarettes, a cigar, or pipe, or using snuff or chewing tobacco?",
      "isRequired": true,
      "autoGenerate": false,
      "rateValues": [
       {
        "value": "0",
        "text": "Not at all"
       },
       {
        "value": "1",
        "text": "Slight"
       },
       {
        "value": "2",
        "text": "Mild"
       },
       {
        "value": "3",
        "text": "Moderate"
       },
       {
        "value": "4",
        "text": "Severe"
       }
      ]
     },
     {
      "type": "rating",
      "name": "assessment23",
      "title": "Using any of the following medicines ON YOUR OWN, that is, without a doctor’s prescription, in greater amounts or longer than prescribed [e.g., painkillers (like Vicodin), stimulants (like Ritalin or Adderall), sedatives or tranquilizers (like sleeping pills or Valium), or drugs like marijuana, cocaine or crack, club drugs (like ecstasy), hallucinogens (like LSD), heroin, inhalants or solvents (like glue), or methamphetamine (like speed)]?",
      "isRequired": true,
      "autoGenerate": false,
      "rateValues": [
       {
        "value": "0",
        "text": "Not at all"
       },
       {
        "value": "1",
        "text": "Slight"
       },
       {
        "value": "2",
        "text": "Mild"
       },
       {
        "value": "3",
        "text": "Moderate"
       },
       {
        "value": "4",
        "text": "Severe"
       }
      ]
     }
    ]
   }
  ],
  "pageNextText": "I Agree",
  "widthMode": "responsive"
 }
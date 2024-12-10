import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from model import SubscriberDB

# Function to send email notifications to all subscribers about a new event
def send_email_notification(event):
    db = SessionLocal()  # Create a new database session
    subscribers = db.query(subscribers).all()  # Query all subscribers from the database
    for subscriber in subscribers:
        send_email(subscriber.email, event)  # Send an email to each subscriber

# Function to send an email to a specific email address about a new event
def send_email(to_email, event):
    from_email = "jay@898522@gmail.com"
    from_password = "Fakepassword21!"
    to_email = "intogamerx123@gmail.com"
    subject = "New Event Created"  # Subject of the email
    body = f"A new event '{event.name}' has been created."  # Body of the email

    # Create a MIME multipart message
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))  # Attach the email body to the message

    # Set up the SMTP server and send the email
    server = smtplib.SMTP('smtp.gmail.com', 587)  # Connect to the Gmail SMTP server
    server.starttls()  # Start TLS encryption
    server.login(from_email, from_password)  # Log in to the email account
    text = msg.as_string()  # Convert the message to a string
    server.sendmail(from_email, to_email, text)  # Send the email
    server.quit()  # Quit the SMTP server

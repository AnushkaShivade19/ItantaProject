from sqlalchemy import Column, Integer, String, Float, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from enum import Enum as PyEnum

class Status(PyEnum):
    PENDING = 'pending'
    COMPLETED = 'completed'

Base = declarative_base()

class MenuItem(Base):
    __tablename__ = 'menu_items'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    price = Column(Float)

    def __init__(self, name, price):
        if price < 0:
            raise ValueError('Price cannot be negative')
        self.name = name
        self.price = price


class Review(Base):
    __tablename__ = 'reviews'
    id = Column(Integer, primary_key=True)
    text = Column(String)
    rating = Column(Integer)

    def __init__(self, text, rating):
        self.text = text
        self.rating = rating


class Order(Base):
    __tablename__ = 'orders'
    id = Column(Integer, primary_key=True)
    status = Column(Enum(Status))

    def __init__(self, status):
        self.status = status
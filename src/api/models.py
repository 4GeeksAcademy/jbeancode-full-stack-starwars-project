from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship, DeclarativeBase
from typing import List

db = SQLAlchemy()

user_favorite_characters = Table(
    "user_favorite_characters",
    db.metadata,
    Column("user_id", ForeignKey("user.id"), primary_key=True),
    Column("character_id", ForeignKey("character.id"), primary_key=True),
)

user_favorite_planets = Table(
    "user_favorite_planets",
    db.metadata,
    Column("user_id", ForeignKey("user.id"), primary_key=True),
    Column("planet_id", ForeignKey("planet.id"), primary_key=True),
)


class User(db.Model):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    favorite_characters: Mapped[List["Character"]] = relationship(
        "Character", secondary=user_favorite_characters, back_populates="favorited_by_users",)

    favorite_planets: Mapped[List["Planet"]] = relationship(
        "Planet", secondary=user_favorite_planets, back_populates="favorited_by_users",)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "favorite_characters": [character.serialize() for character in self.favorite_characters],
            "favorite_planets": [planet.serialize() for planet in self.favorite_planets],
            # do not serialize the password, it is a security breach
        }


class Character(db.Model):
    __tablename__ = "character"
    id: Mapped[int] = mapped_column(primary_key=True)
    char_image: Mapped[str] = mapped_column()
    name: Mapped[str] = mapped_column(String(50))
    age: Mapped[int] = mapped_column()
    description: Mapped[str] = mapped_column(String(555))
    home_planet_id: Mapped[int] = mapped_column(ForeignKey("planet.id"))
    planet: Mapped["Planet"] = relationship("Planet", back_populates="characters")
    favorited_by_users: Mapped[List["User"]] = relationship("User", secondary=user_favorite_characters, back_populates="favorite_characters",)

    def serialize(self):
        return {
            "id": self.id,
            "char_image": self.char_image,
            "name": self.name,
            "age": self.age,
            "description": self.age,
            "planet": self.planet.name,
            "favorited_by_users": [user.email for user in self.favorited_by_users],
            # do not serialize the password, it is a security breach
        }


class Planet(db.Model):
    __tablename__ = "planet"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50))
    terrain: Mapped[str] = mapped_column(String(500))
    planet_image: Mapped[str] = mapped_column(String(500))
    population: Mapped[int] = mapped_column()
    characters: Mapped[List["Character"]] = relationship("Character", back_populates="planet")
    favorited_by_users: Mapped[List["User"]] = relationship("User", secondary=user_favorite_planets, back_populates="favorite_planets",)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "terrain": self.terrain,
            "planet_image": self.planet_image,
            "population": self.population,
            "characters": [character.name for character in self.characters],
            "favorited_by_users": [user.email for user in self.favorited_by_users],
            # do not serialize the password, it is a security breach
        }
"""
Tests for HeroSection component props
"""
import pytest
from 7th_heaven_bakery.src.components import HeroSection

def test_hero_section_has_bakery_name():
    assert hasattr(HeroSection, 'bakery_name'), "Bakery name prop not found"

def test_hero_section_has_tagline():
    assert hasattr(HeroSection, 'tagline'), "Tagline prop not found"

def test_hero_section_has_cta_button():
    assert hasattr(HeroSection, 'cta_button'), "CTA button prop not found"

def test_hero_section_props_are_strings():
    assert isinstance(HeroSection.bakery_name, str), "Bakery name must be a string"
    assert isinstance(HeroSection.tagline, str), "Tagline must be a string"
    assert isinstance(HeroSection.cta_button, str), "CTA button text must be a string"
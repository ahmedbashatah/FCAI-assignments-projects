
from django import forms
from .models import User

class SignupForm(forms.ModelForm):
    confirm_password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ['username','password','confirm_password','email','is_admin']
        widgets = {'password': forms.PasswordInput()}

    def clean(self):
        c = super().clean()
        if c.get('password') != c.get('confirm_password'):
            raise forms.ValidationError("Passwords do not match")
        return c

class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)
    is_admin = forms.BooleanField(required=False)

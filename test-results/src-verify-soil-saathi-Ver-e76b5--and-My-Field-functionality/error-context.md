# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications (F8)":
    - list
  - region "Notifications alt+T"
  - generic [ref=e4]:
    - generic [ref=e5]:
      - img [ref=e8]
      - heading "Plant Saathi AI" [level=3] [ref=e11]
      - paragraph [ref=e12]: Your intelligent farming companion
    - generic [ref=e13]:
      - generic [ref=e14]:
        - tablist [ref=e15]:
          - tab "Sign In" [active] [selected] [ref=e16] [cursor=pointer]
          - tab "Sign Up" [ref=e17] [cursor=pointer]
          - tab "Phone" [ref=e18] [cursor=pointer]
        - tabpanel "Sign In" [ref=e19]:
          - generic [ref=e20]:
            - generic [ref=e21]:
              - text: Email
              - generic [ref=e22]:
                - img [ref=e23]
                - textbox "Email" [ref=e26]:
                  - /placeholder: farmer@example.com
                  - text: justfun2842@gmail.com
            - generic [ref=e27]:
              - text: Password
              - generic [ref=e28]:
                - img [ref=e29]
                - textbox "Password" [ref=e32]:
                  - /placeholder: ••••••••
                  - text: "123456789"
            - button "Sign In" [ref=e33] [cursor=pointer]
      - paragraph [ref=e35]: Trusted by farmers across India 🌾
  - button [ref=e36] [cursor=pointer]:
    - img
```
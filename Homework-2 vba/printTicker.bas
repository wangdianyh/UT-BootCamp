Attribute VB_Name = "printTicker"
Public Sub printTicker()
    Range("I1").Value = "Ticker"
    Dim insert As String
    
    For I = 2 To Cells(Rows.Count, "A").End(xlUp).Row
    ' For i = 2 To 5

        insert = Cells(I, "A").Value
        If Range("I2").Value = "" Then
            Range("I2").Value = insert
        Else
            Dim find As Range
            Set find = Range("I:I").find(What:=insert, LookIn:=xlValues, LookAt:=xlWhole)
            'check if ticker is there already
            If find Is Nothing Then
                Dim addRow As Integer
                addRow = Cells(Rows.Count, "I").End(xlUp).Row + 1
                Cells(addRow, "I").Value = insert
            End If
        End If
    Next I
    MsgBox ("finish adding ticker")
End Sub
' print ticker list


